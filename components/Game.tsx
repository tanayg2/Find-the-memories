"use client"

import { useState, useEffect, useRef } from "react"
import Player from "./Player"
import Platform from "./Platform"
import Rose from "./Rose"
import Controls from "./Controls"
import Overlay from "./Overlay"

const GAME_HEIGHT = 500
const GRAVITY = 0.5
const JUMP_FORCE = 12
const MOVE_SPEED = 5
const GROUND_HEIGHT = 20
const CAMERA_BUFFER_PERCENT = 0.2 // 20% of screen width

interface GameState {
  playerX: number
  playerY: number
  playerVelocityY: number
  isJumping: boolean
  direction: "left" | "right" | "idle"
  rosesCollected: number
  gameCompleted: boolean
  cameraX: number
}

const platforms = [
  { x: 0, y: GAME_HEIGHT - GROUND_HEIGHT, width: 5000, height: GROUND_HEIGHT },
  { x: 0, y: 400, width: 300, height: 20 },
  { x: 350, y: 300, width: 200, height: 20 },
  { x: 600, y: 200, width: 200, height: 20 },
  { x: 850, y: 350, width: 150, height: 20 },
  { x: 1100, y: 250, width: 200, height: 20 },
  { x: 1400, y: 350, width: 250, height: 20 },
  { x: 1700, y: 200, width: 300, height: 20 },
  { x: 2100, y: 300, width: 200, height: 20 },
  { x: 2400, y: 250, width: 250, height: 20 },
  { x: 2700, y: 350, width: 200, height: 20 },
  { x: 3000, y: 200, width: 300, height: 20 },
  { x: 3400, y: 300, width: 250, height: 20 },
  { x: 3800, y: 250, width: 200, height: 20 },
  { x: 4200, y: 350, width: 300, height: 20 },
  { x: 4600, y: 250, width: 250, height: 20 },
]

const roses = [
  { x: 250, y: 350, collected: false },
  { x: 1000, y: 300, collected: false },
  { x: 2000, y: 150, collected: false },
  { x: 3500, y: 250, collected: false },
  { x: 4800, y: 200, collected: false },
]

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    playerX: 50,
    playerY: 350,
    playerVelocityY: 0,
    isJumping: false,
    direction: "idle",
    rosesCollected: 0,
    gameCompleted: false,
    cameraX: 0,
  })

  const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1000)

  const gameLoopRef = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current)
    }
  }, [])

  const gameLoop = () => {
    setGameState((prevState) => {
      const newState = { ...prevState }

      // Apply gravity
      newState.playerVelocityY += GRAVITY
      newState.playerY += newState.playerVelocityY

      // Move player
      if (newState.direction === "left") newState.playerX -= MOVE_SPEED
      if (newState.direction === "right") newState.playerX += MOVE_SPEED

      // Check platform collisions
      let onPlatform = false
      for (const platform of platforms) {
        if (
          newState.playerX < platform.x + platform.width &&
          newState.playerX + 40 > platform.x &&
          newState.playerY < platform.y + platform.height &&
          newState.playerY + 60 > platform.y
        ) {
          // Check if colliding from above
          if (prevState.playerY + 60 <= platform.y) {
            newState.playerY = platform.y - 60
            newState.playerVelocityY = 0
            newState.isJumping = false
            onPlatform = true
          }
          // Check if colliding from below
          else if (prevState.playerY >= platform.y + platform.height) {
            newState.playerY = platform.y + platform.height
            newState.playerVelocityY = 0
          }
          // Check if colliding from the sides
          else {
            if (newState.direction === "left") {
              newState.playerX = platform.x + platform.width
            } else if (newState.direction === "right") {
              newState.playerX = platform.x - 40
            }
          }
          break
        }
      }

      if (!onPlatform) {
        newState.isJumping = true
      }

      // Check rose collisions
      roses.forEach((rose, index) => {
        if (
          !rose.collected &&
          newState.playerX < rose.x + 30 &&
          newState.playerX + 40 > rose.x &&
          newState.playerY < rose.y + 30 &&
          newState.playerY + 60 > rose.y
        ) {
          roses[index].collected = true
          newState.rosesCollected++
          if (newState.rosesCollected === 5) {
            newState.gameCompleted = true
          }
        }
      })

      // Keep player within bounds
      newState.playerX = Math.max(0, Math.min(newState.playerX, 5000 - 40))
      newState.playerY = Math.min(newState.playerY, GAME_HEIGHT - 60)

      // Prevent falling below the ground
      if (newState.playerY > GAME_HEIGHT - GROUND_HEIGHT - 60) {
        newState.playerY = GAME_HEIGHT - GROUND_HEIGHT - 60
        newState.playerVelocityY = 0
        newState.isJumping = false
      }

      // Update camera position based on screen width
      const cameraBuffer = screenWidth * CAMERA_BUFFER_PERCENT
      if (newState.playerX > newState.cameraX + screenWidth - cameraBuffer) {
        newState.cameraX = newState.playerX - (screenWidth - cameraBuffer)
      } else if (newState.playerX < newState.cameraX + cameraBuffer) {
        newState.cameraX = newState.playerX - cameraBuffer
      }
      newState.cameraX = Math.max(0, Math.min(newState.cameraX, 5000 - screenWidth))

      return newState
    })

    gameLoopRef.current = requestAnimationFrame(gameLoop)
  }

  const handleMove = (direction: "left" | "right" | "idle") => {
    setGameState((prevState) => ({ ...prevState, direction }))
  }

  const handleJump = () => {
    setGameState((prevState) => {
      if (!prevState.isJumping) {
        return { ...prevState, playerVelocityY: -JUMP_FORCE, isJumping: true }
      }
      return prevState
    })
  }

  const restart = () => {
    setGameState({
      playerX: 50,
      playerY: 350,
      playerVelocityY: 0,
      isJumping: false,
      direction: "idle",
      rosesCollected: 0,
      gameCompleted: false,
      cameraX: 0,
    })

    roses.forEach((rose) => (rose.collected = false))
  }

  return (
    <div className="game-container" style={{ width: "100vw", height: GAME_HEIGHT }}>
      <div
        className="game-world"
        style={{
          transform: `translateX(-${gameState.cameraX}px)`,
          width: "5000px",
          height: "100%",
          position: "relative",
        }}
      >
        <div
          className="background"
          style={{
            backgroundImage: "url(/placeholder.svg?height=500&width=5000)",
            backgroundRepeat: "repeat-x",
            width: "5000px",
            height: "100%",
            position: "absolute",
            transform: `translateX(${gameState.cameraX * 0.5}px)`,
          }}
        />
        <Player x={gameState.playerX} y={gameState.playerY} />
        {platforms.map((platform, index) => (
          <Platform key={index} {...platform} />
        ))}
        {roses.map((rose, index) => (
          <Rose key={index} {...rose} />
        ))}
      </div>
      <div className="rose-counter">Roses: {gameState.rosesCollected}/5</div>
      <Controls onMove={handleMove} onJump={handleJump} />
      {gameState.gameCompleted && <Overlay onRestart={restart} />}
    </div>
  )
}


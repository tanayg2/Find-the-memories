"use client"

import { useState, useEffect, useRef } from "react"
import Player from "./Player"
import Platform from "./Platform"
import Rose from "./Rose"
import Controls from "./Controls"
import Overlay from "./Overlay"

const GAME_HEIGHT = 700
const GRAVITY = 0.5
const JUMP_FORCE = 14
const MOVE_SPEED = 5
const GROUND_HEIGHT = 28
const CAMERA_BUFFER_PERCENT = 0.2 // 20% of screen width
export const PLAYER_HEIGHT = 80
export const PLAYER_WIDTH = 60

interface GameState {
  playerX: number
  playerY: number
  playerVelocityY: number
  isJumping: boolean
  direction: "left" | "right" | "idle"
  gameCompleted: boolean
  cameraX: number
}

const platforms = [
  { x: 0, y: GAME_HEIGHT - GROUND_HEIGHT, width: 5000, height: GROUND_HEIGHT },
  { x: 130, y: 560, width: 200, height: 28 },
  { x: 350, y: 420, width: 200, height: 28 },
  { x: 600, y: 280, width: 200, height: 28 },
  { x: 850, y: 490, width: 150, height: 28 },
  { x: 1100, y: 350, width: 200, height: 28 },
  { x: 1400, y: 420, width: 250, height: 28 },
  { x: 1700, y: 280, width: 300, height: 28 },
  { x: 2100, y: 420, width: 200, height: 28 },
  { x: 2400, y: 350, width: 250, height: 28 },
  { x: 2700, y: 490, width: 200, height: 28 },
  { x: 3000, y: 280, width: 300, height: 28 },
  { x: 3400, y: 420, width: 250, height: 28 },
  { x: 3800, y: 350, width: 200, height: 28 },
  { x: 4100, y: 490, width: 400, height: 28 },
  { x: 4600, y: 350, width: 250, height: 28 },
]

const roses = [
  { x: 250, y: 490, collected: false },
  { x: 1000, y: 420, collected: false },
  { x: 2000, y: 210, collected: false },
  { x: 3500, y: 350, collected: false },
  { x: 4800, y: 280, collected: false },
]

export default function Game() {
  const [gameState, setGameState] = useState<GameState>({
    playerX: 50,
    playerY: 490,
    playerVelocityY: 0,
    isJumping: false,
    direction: "idle",
    gameCompleted: false,
    cameraX: 0,
  })

  const [rosesCollected, setRosesCollected] = useState(0)
  const [overlayOpen, setOverlayOpen] = useState(false)

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
          newState.playerX + PLAYER_WIDTH > platform.x &&
          newState.playerY < platform.y + platform.height &&
          newState.playerY + PLAYER_HEIGHT > platform.y
        ) {
          // Check if colliding from above
          if (prevState.playerY + PLAYER_HEIGHT <= platform.y) {
            newState.playerY = platform.y -PLAYER_HEIGHT 
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
              newState.playerX = platform.x -PLAYER_WIDTH 
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
          newState.playerX + PLAYER_WIDTH > rose.x &&
          newState.playerY < rose.y + 30 &&
          newState.playerY + PLAYER_HEIGHT > rose.y
        ) {
          roses[index].collected = true
          setRosesCollected(prev => {
            const newCount = prev + 1
            if (newCount >= 5) {
              setOverlayOpen(true)
            }
            return newCount
          })
        }
      })

      // Keep player within bounds
      newState.playerX = Math.max(0, Math.min(newState.playerX, 5000 - PLAYER_WIDTH))
      newState.playerY = Math.min(newState.playerY, GAME_HEIGHT - PLAYER_HEIGHT)

      // Prevent falling below the ground
      if (newState.playerY > GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT) {
        newState.playerY = GAME_HEIGHT - GROUND_HEIGHT -PLAYER_HEIGHT 
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
            backgroundRepeat: "repeat-x",
            width: "5000px",
            height: "100%",
            position: "absolute",
            transform: `translateX(${gameState.cameraX * 0.5}px)`,
          }}
        />
        <Player x={gameState.playerX} y={gameState.playerY} direction={gameState.direction} />
        {platforms.map((platform, index) => (
          <Platform key={index} {...platform} />
        ))}
        {roses.map((rose, index) => (
          <Rose key={index} {...rose} index={index} />
        ))}
      </div>
      <div className="rose-counter">Memories: {rosesCollected}/5</div>
      <Controls onMove={handleMove} onJump={handleJump} rosesCollected={rosesCollected} />
      <Overlay open={overlayOpen}  />
    </div>
  )
}


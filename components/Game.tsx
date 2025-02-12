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
export const PLAYER_HEIGHT = 80
export const PLAYER_WIDTH = 60
export const PLAYER_URL = "https://firebasestorage.googleapis.com/v0/b/waldo-a2cc8.appspot.com/o/vday-game%2Femily.png?alt=media&token=90a65c33-edcc-4a84-9966-dd15acc25ddb"
export const ROSE_URLS = [
  "https://firebasestorage.googleapis.com/v0/b/waldo-a2cc8.appspot.com/o/vday-game%2Fcouplepic1.jpeg?alt=media&token=250cb2d4-5c52-40d8-9333-78c306acdb3a",
  "https://firebasestorage.googleapis.com/v0/b/waldo-a2cc8.appspot.com/o/vday-game%2Fcouplepic2.jpeg?alt=media&token=ed8bb0e5-70eb-4eef-8d1d-d581bdec20ed",
  "https://firebasestorage.googleapis.com/v0/b/waldo-a2cc8.appspot.com/o/vday-game%2Fcouplepic3.jpeg?alt=media&token=6f889430-0592-4f39-8007-b8277d081429",
  "https://firebasestorage.googleapis.com/v0/b/waldo-a2cc8.appspot.com/o/vday-game%2Fcouplepic4.jpeg?alt=media&token=0237d35d-fbfe-42b2-aaa7-02a7df3ebca8",
  "https://firebasestorage.googleapis.com/v0/b/waldo-a2cc8.appspot.com/o/vday-game%2Fcouplepic5.jpeg?alt=media&token=f290ba72-752c-460b-b93e-19cc50fea765"
]

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
  { x: 130, y: 400, width: 200, height: 20 },
  { x: 350, y: 300, width: 200, height: 20 },
  { x: 600, y: 200, width: 200, height: 20 },
  { x: 850, y: 350, width: 150, height: 20 },
  { x: 1100, y: 250, width: 200, height: 20 },
  { x: 1400, y: 300, width: 250, height: 20 },
  { x: 1700, y: 200, width: 300, height: 20 },
  { x: 2100, y: 300, width: 200, height: 20 },
  { x: 2400, y: 250, width: 250, height: 20 },
  { x: 2700, y: 350, width: 200, height: 20 },
  { x: 3000, y: 200, width: 300, height: 20 },
  { x: 3400, y: 300, width: 250, height: 20 },
  { x: 3800, y: 250, width: 200, height: 20 },
  { x: 4100, y: 350, width: 400, height: 20 },
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


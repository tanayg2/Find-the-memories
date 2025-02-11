import { useEffect, useState } from "react"
import { PLAYER_HEIGHT, PLAYER_WIDTH } from "./Game"

interface PlayerProps {
  x: number
  y: number
  direction: "left" | "right" | "idle"
}

export default function Player({ x, y, direction }: PlayerProps) {
  const [previousDirection, setPreviousDirection] = useState<"left" | "right">(
    "right"
  )
  useEffect(() => {
    if (direction !== "idle") {
      setPreviousDirection(direction)
    }
  }, [direction]) 


  return (
    <div
      className="player"
      style={{
        left: x,
        top: y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        position: "absolute",
        backgroundImage: "url('/emily.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: previousDirection === "left" ? "scaleX(1)" : "scaleX(-1)"  
      }}
    />
  )
}


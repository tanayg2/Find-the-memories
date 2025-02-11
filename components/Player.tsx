import { useEffect, useState } from "react"

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
        width: 40,
        height: 60,
        position: "absolute",
        backgroundImage: "url('/emily.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: previousDirection === "left" ? "scaleX(1)" : "scaleX(-1)"  
      }}
    />
  )
}


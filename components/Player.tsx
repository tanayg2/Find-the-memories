import { useEffect, useState } from "react"
import { PLAYER_HEIGHT, PLAYER_URL, PLAYER_WIDTH } from "./Game"
import Image from "next/image"

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
    <Image
      className="player"
      src={PLAYER_URL}
      alt="Emily"
      width={60}
      height={80}
      style={{
        left: x,
        top: y,
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
        position: "absolute",
        // backgroundImage: "url('/emily.png')",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        transform: previousDirection === "left" ? "scaleX(1)" : "scaleX(-1)"  
      }}
    />
  )
}


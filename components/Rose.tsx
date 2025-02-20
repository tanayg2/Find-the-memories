import Image from "next/image"
import { ROSE_URLS } from "./Game"

interface RoseProps {
  x: number
  y: number
  index: number
  collected: boolean
}

export default function Rose({ x, y, collected, index }: RoseProps) {
  const style = {
    left: collected ? index * 75 : x, // 40px width + 5px gap between collected roses
    top: collected ? window.innerHeight - 850 : y,  // Place at bottom of screen when collected
    width: collected ? 70 : 40,
    height: collected ? 70 : 40,
    position: "absolute" as const,
    // backgroundImage: `url('/couplePic${index + 1}.jpeg')`,
    // backgroundSize: "cover",
    // backgroundPosition: "center",
    transition: "all 0.3s ease", // Smooth transition when collecting
  }

  return (
    <Image
      src={ROSE_URLS[index]}
      alt={`Rose ${index + 1}`}
      width={40}
      height={40}
      style={style}
    />
  )
}


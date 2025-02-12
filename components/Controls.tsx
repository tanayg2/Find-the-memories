import { ArrowBigLeft, ArrowBigRight, ArrowBigUp } from "lucide-react"
import Image from "next/image"
import { ROSE_URLS } from "./Game"

interface ControlsProps {
  onMove: (direction: "left" | "right" | "idle") => void
  onJump: () => void
  rosesCollected: number
}

export default function Controls({ onMove, onJump, rosesCollected }: ControlsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        {[...Array(5)].map((_, i) => (
          <Image
            alt={`Rose ${i + 1}`}
            src={ROSE_URLS[i]}
            width={70}
            height={70}
            key={i} 
            className="z-20 fixed translate-y-[-450px]"
            style={{
              transition: "all 0.3s ease", // Smooth transition when collecting
              opacity: i < rosesCollected ? 1 : 0,
              left: i * 76 + 6,
              // backgroundImage: `url('/img/couplePic${i + 1}.jpeg')`,
              // backgroundSize: "cover",
              // backgroundPosition: "center",
              width: 70,
              height: 70,
            }}
          />
        ))}
      </div>
    <div className="controls">
      <button className="bg-pink-50 rounded-2xl" onTouchStart={() => onMove("left")} onTouchEnd={() => onMove("idle")}>
        <ArrowBigLeft width={80} height={80} />
      </button>
      <button className="bg-pink-50 rounded-2xl" onTouchStart={() => onMove("right")} onTouchEnd={() => onMove("idle")}>
        <ArrowBigRight width={80} height={80} />
      </button>
      <button className="bg-pink-50 rounded-2xl" onTouchStart={onJump}>
        <ArrowBigUp width={80} height={80} />
      </button>
    </div>
</div>
  )
}


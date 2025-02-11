import { ArrowBigLeft, ArrowBigRight, ArrowBigUp } from "lucide-react"
import Image from "next/image"

interface ControlsProps {
  onMove: (direction: "left" | "right" | "idle") => void
  onJump: () => void
  rosesCollected: number
}

export default function Controls({ onMove, onJump, rosesCollected }: ControlsProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row mt-5">
        {[...Array(5)].map((_, i) => (
          <Image
            src={`/couplepic${i + 1}.jpeg`}
            width={80}
            height={80}
            alt={`Rose ${i + 1}`}
            key={i} 
            className="z-20 fixed"
            style={{
              transition: "all 0.3s ease", // Smooth transition when collecting
              opacity: i < rosesCollected ? 1 : 0,
              left: i * 86 + 6,
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


import { ArrowBigLeft, ArrowBigRight, ArrowBigUp } from "lucide-react"

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
          <div
            key={i} 
            className="z-20 fixed translate-y-[-450px]"
            style={{
              transition: "all 0.3s ease", // Smooth transition when collecting
              opacity: i < rosesCollected ? 1 : 0,
              left: i * 66 + 6,
              backgroundImage: `url('/couplePic${i + 1}.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
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


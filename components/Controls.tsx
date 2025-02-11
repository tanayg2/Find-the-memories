interface ControlsProps {
  onMove: (direction: "left" | "right" | "idle") => void
  onJump: () => void
}

export default function Controls({ onMove, onJump }: ControlsProps) {
  return (
    <div className="controls">
      <button className="control-btn left" onTouchStart={() => onMove("left")} onTouchEnd={() => onMove("idle")}>
        ←
      </button>
      <button className="control-btn right" onTouchStart={() => onMove("right")} onTouchEnd={() => onMove("idle")}>
        →
      </button>
      <button className="control-btn jump" onTouchStart={onJump}>
        Jump
      </button>
    </div>
  )
}


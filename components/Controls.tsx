interface ControlsProps {
  onMove: (direction: "left" | "right" | "idle") => void
  onJump: () => void
  rosesCollected: number
}

export default function Controls({ onMove, onJump, rosesCollected }: ControlsProps) {
  return (
    <div className="controls">
      <div className="roses-display">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="rose-icon"
            style={{
              width: '30px',
              height: '30px',
              backgroundImage: "url('/emily.png')",
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              opacity: i < rosesCollected ? 1 : 0.3,
              margin: '0 5px'
            }}
          />
        ))}
      </div>
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


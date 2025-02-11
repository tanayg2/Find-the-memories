interface PlayerProps {
  x: number
  y: number
}

export default function Player({ x, y }: PlayerProps) {
  return (
    <div
      className="player"
      style={{
        left: x,
        top: y,
        width: 40,
        height: 60,
        backgroundColor: "#ff69b4",
        position: "absolute",
        borderRadius: "50% 50% 0 0",
      }}
    >
      <div className="player-face" style={{ position: "relative", top: 10 }}>
        <div className="player-eye" style={{ left: 8 }} />
        <div className="player-eye" style={{ right: 8 }} />
        <div className="player-mouth" />
      </div>
    </div>
  )
}


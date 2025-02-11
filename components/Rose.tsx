interface RoseProps {
  x: number
  y: number
  collected: boolean
}

export default function Rose({ x, y, collected }: RoseProps) {
  if (collected) return null

  return (
    <div
      className="rose"
      style={{
        left: x,
        top: y,
        width: 30,
        height: 30,
        position: "absolute",
      }}
    >
      <div className="rose-stem" />
      <div className="rose-petal" />
    </div>
  )
}


interface PlatformProps {
  x: number
  y: number
  width: number
  height: number
}

export default function Platform({ x, y, width, height }: PlatformProps) {
  return (
    <div
      className="platform"
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "#4a4a4a",
        position: "absolute",
      }}
    />
  )
}


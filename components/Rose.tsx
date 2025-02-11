interface RoseProps {
  x: number
  y: number
  index: number
  collected: boolean
}

export default function Rose({ x, y, collected, index }: RoseProps) {
  const style = {
    left: collected ? index * 75 : x, // 40px width + 5px gap between collected roses
    top: collected ? window.innerHeight - 60 : y, // Place at bottom of screen when collected
    width: collected ? 70 : 40,
    height: collected ? 60 : 40,
    position: "absolute" as const,
    backgroundImage: `url('/couplePic${index + 1}.jpeg')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "all 0.3s ease", // Smooth transition when collecting
  }

  return (
    <div
      className="rose"
      style={style}
    />
  )
}


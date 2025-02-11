interface OverlayProps {
  onRestart: () => void
}

export default function Overlay({ onRestart }: OverlayProps) {
  const handleYesClick = () => {
    alert("Happy Valentine's Day! ❤️")
  }

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>You collected all 5 roses!</h2>
        <h3>Will you be my Valentine?</h3>
        <div className="overlay-buttons">
          <button onClick={handleYesClick}>Yes</button>
          <button onClick={handleYesClick}>Yes</button>
        </div>
        <button className="restart-btn" onClick={onRestart}>
          Restart Game
        </button>
      </div>
    </div>
  )
}


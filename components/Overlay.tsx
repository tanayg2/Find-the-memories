import ReactConfetti from "react-confetti"
import { Dialog, DialogContent } from "./ui/dialog"

interface OverlayProps {
  open: boolean
}

export default function Overlay({ open }: OverlayProps) {
  const handleYesClick = () => {
    alert("Happy Valentine's Day baby ❤️")
  }

  return (
    <Dialog open={true} onOpenChange={() => false} >
      <DialogContent className="overlay-content h-screen">
      <ReactConfetti className="" />
        <h2>You collected all 5 roses!</h2>
        <h3>Will you be my Valentine?</h3>
        <div className="overlay-buttons">
          <button onClick={handleYesClick}>Yes</button>
          <button onClick={handleYesClick}>Yes</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


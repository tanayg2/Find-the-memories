import ReactConfetti from "react-confetti"
import { Dialog, DialogContent } from "./ui/dialog"
import Image from "next/image"

interface OverlayProps {
  open: boolean
}

export default function Overlay({ open }: OverlayProps) {
  const handleYesClick = () => {
    alert("Woohoo! Happy Valentine's Day baby ❤️")
  }

  return (
    <Dialog open={true} onOpenChange={() => false} >
      <DialogContent className="overlay-content h-screen">
      <ReactConfetti className="" />
        <h2 className="mt-40">You collected all 5 memories!</h2>
        <h3>Will you be my Valentine?</h3>
        <div className="flex flex-row">
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
              left: i * 86 + 3,
            }}
          />
        ))}
      </div>
        <div className="overlay-buttons">
          <button onClick={handleYesClick}>Yes</button>
          <button onClick={handleYesClick}>Yes</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


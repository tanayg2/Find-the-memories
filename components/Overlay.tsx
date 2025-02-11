import ReactConfetti from "react-confetti"
import { Dialog, DialogContent } from "./ui/dialog"

interface OverlayProps {
  open: boolean
}

export default function Overlay({ open }: OverlayProps) {
  const handleYesClick = () => {
    alert("Woohoo! Happy Valentine's Day baby ❤️")
  }

  return (
    <Dialog open={open} onOpenChange={() => false} >
      <DialogContent className="overlay-content h-screen">
      <ReactConfetti className="" />
        <h2 className="mt-40">You collected all 5 memories!</h2>
        <h3>Will you be my Valentine?</h3>
        <div className="flex flex-row relative">
        <div
          style={{
            backgroundImage: `url('/emily.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="z-40 absolute top-[-100px] left-1/2 h-[100px] w-[90px] animate-bounce duration-500" 
         />
        {[...Array(5)].map((_, i) => (
          <div
            key={i} 
            className="z-20 fixed h-[70px] w-[70px]"
            style={{
              backgroundImage: `url('/couplePic${i + 1}.jpeg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "all 0.3s ease", // Smooth transition when collecting
              left: i * 76 + 6,
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


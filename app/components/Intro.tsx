type IntroProps = {
  onStart: () => void
}

export default function Intro({ onStart }: IntroProps) {
  return (
    <div className="text-center space-y-6 px-4">
      <h1 className="text-4xl font-bold">
        Carecode Online Photobooth
      </h1>

      <p className="text-gray-400 max-w-md mx-auto">
        Snap, pose, and download your photos in just a few clicks.
      </p>

      <button
        onClick={onStart}
        className="
          px-8 py-3
          rounded-xl
          font-semibold
          text-white
          cursor-pointer
          transition-all duration-200
          bg-[hsl(208,50%,30%)]
          hover:bg-[#5BA67B]
          shadow-lg
        "
      >
        Start Photobooth
      </button>
    </div>
  )
}

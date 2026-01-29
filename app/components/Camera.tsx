export default function Camera() {
  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      {/* Camera Preview */}
      <div
        className="
          w-full
          max-w-2xl
          aspect-[4/3]
          rounded-2xl
          bg-gray-800
          flex items-center justify-center
          overflow-hidden
        "
      >
        <span className="text-gray-400">
          Camera Preview (4:3)
        </span>
      </div>

      {/* Capture Button */}
      <button
        className="
          px-6 py-3
          rounded-xl
          font-semibold
          text-white
          bg-[#5BA67B]
          cursor-pointer
          transition
          hover:scale-105
          active:scale-95
        "
      >
        Capture
      </button>
    </div>
  )
}

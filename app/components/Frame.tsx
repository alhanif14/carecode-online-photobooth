"use client"

import { useEffect, useRef, useState } from "react"

type FrameProps = {
  photos: string[]
}

const FRAMES = [
  { id: "none", src: null },
  { id: "frame1", src: "/frames/frame1.png" },
  { id: "frame2", src: "/frames/frame2.png" },
]

export default function Frame({ photos }: FrameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0])

  useEffect(() => {
    if (photos.length === 3) {
      renderCanvas()
    }
  }, [photos, selectedFrame])

  const renderCanvas = async () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const padding = 8
    const bottomPadding = 150
    const photoWidth = 400
    const photoHeight = 300

    canvas.width = photoWidth + padding * 2
    canvas.height =
      padding * 2 +
      photoHeight * 3 +
      bottomPadding

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < photos.length; i++) {
      const img = await loadImage(photos[i])
      ctx.drawImage(
        img,
        padding,
        padding + i * photoHeight,
        photoWidth,
        photoHeight
      )
    }

    if (selectedFrame.src) {
      const frameImg = await loadImage(selectedFrame.src)
      ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)
    }
  }

  const downloadImage = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.download = "carecode-photobooth.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full px-4">
        <div className="w-full max-w-[220px] sm:max-w-[260px] bg-white p-3 rounded-2xl shadow-xl">
        <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-lg"
            style={{ imageRendering: "auto" }}
        />
        </div>

      {/* FRAME OPTIONS */}
      <div className="flex gap-4 flex-wrap justify-center">
        {FRAMES.map((frame) => (
          <button
            key={frame.id}
            onClick={() => setSelectedFrame(frame)}
            className={`
              w-20 h-32 rounded-xl overflow-hidden
              border-2 cursor-pointer transition
              ${
                selectedFrame.id === frame.id
                  ? "border-[#5BA67B]"
                  : "border-transparent"
              }
            `}
          >
            {frame.src ? (
              <img
                src={frame.src}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No Frame
              </div>
            )}
          </button>
        ))}
      </div>

      {/* DOWNLOAD */}
      <button
        onClick={downloadImage}
        className="
          px-8 py-3 rounded-xl
          font-semibold text-white
          bg-[#5BA67B]
          cursor-pointer transition
          hover:scale-105 active:scale-95
        "
      >
        Download Photo
      </button>
    </div>
  )
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve) => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
  })
  
"use client"

import { useEffect, useRef, useState } from "react"

type CameraProps = {
  onDone: (photos: string[]) => void
}

export default function Camera({ onDone }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [countdown, setCountdown] = useState<number | null>(null)
  const [photos, setPhotos] = useState<string[]>([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null)

  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  /* ================= CAMERA ================= */
useEffect(() => {
  let stream: MediaStream | null = null

  async function startCamera() {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    })

    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }

  startCamera()

  return () => {
    // 🔥 INI YANG MATIIN KAMERA
    stream?.getTracks().forEach(track => track.stop())
  }
}, [])


  /* ================= COUNTDOWN ================= */
  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      capturePhoto()
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  /* ================= ACTIONS ================= */
  const startAutoCapture = () => {
    setPhotos([])
    setRetakeIndex(null)
    setIsCapturing(true)
    setCountdown(3)
  }

  const startRetakeSingle = (index: number) => {
    setPreviewIndex(null)
    setRetakeIndex(index)
    setIsCapturing(true)
    setCountdown(3)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = canvas.toDataURL("image/png")

    setPhotos((prev) => {
      const updated = [...prev]

      if (retakeIndex !== null) {
        updated[retakeIndex] = imageData
      } else {
        updated.push(imageData)
      }

      return updated
    })

    if (retakeIndex !== null) {
      setRetakeIndex(null)
      setIsCapturing(false)
      setCountdown(null)
      return
    }

    if (photos.length < 2) {
      setCountdown(3)
    } else {
      setIsCapturing(false)
      setCountdown(null)
    }
  }

  /* ================= UX TEXT ================= */
  const instructionText = () => {
    if (isCapturing) return "Get ready! Photo will be taken automatically."
    if (photos.length === 0)
      return "Click Start Capture. You’ll take 3 photos with a countdown."
    if (photos.length === 3)
      return "Tap a photo to preview. Retake if needed or continue."
    return ""
  }

  /* ================= RENDER ================= */
  return (
    <div className="flex flex-col items-center gap-6 w-full px-4">
      <p className="text-gray-400 text-xl text-center max-w-md">
        {instructionText()}
      </p>

      {/* CAMERA PREVIEW */}
      <div className="relative w-full max-w-2xl aspect-[4/3] rounded-2xl bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <span className="text-white text-7xl font-bold">
              {countdown}
            </span>
          </div>
        )}
      </div>

      {/* START */}
      {photos.length === 0 && (
        <button
          onClick={startAutoCapture}
          className="
            px-8 py-3 rounded-xl font-semibold
            text-white bg-[#5BA67B]
            cursor-pointer transition
            hover:scale-105 active:scale-95
          "
        >
          Start Capture
        </button>
      )}

      {/* ACTIONS */}
      {photos.length === 3 && (
        <div className="flex gap-4">
          <button
            onClick={startAutoCapture}
            className="
              px-6 py-3 rounded-xl font-semibold
              text-white bg-red-500
              cursor-pointer transition hover:bg-red-600
            "
          >
            Retake All
          </button>

          <button
            onClick={() => onDone(photos)}
            className="
              px-6 py-3 rounded-xl font-semibold
              text-white bg-[#5BA67B]
              cursor-pointer transition
              hover:scale-105 active:scale-95
            "
          >
            Choose Frame →
          </button>
        </div>
      )}

      {/* THUMBNAILS */}
      {photos.length > 0 && (
        <div className="flex gap-4">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              onClick={() => setPreviewIndex(index)}
              className="
                w-24 aspect-[4/3]
                object-cover rounded-lg
                cursor-pointer
                hover:ring-2 hover:ring-[#5BA67B]
              "
            />
          ))}
        </div>
      )}

      {/* MODAL PREVIEW */}
      {previewIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 max-w-lg w-full">
            <img
              src={photos[previewIndex]}
              className="w-full rounded-xl mb-4"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setPreviewIndex(null)}
                className="text-gray-500 text-sm"
              >
                Close
              </button>

              <button
                onClick={() => startRetakeSingle(previewIndex)}
                className="text-[#5BA67B] font-semibold text-sm"
              >
                Retake This Photo
              </button>
            </div>
          </div>
        </div>  
      )}

      {/* HIDDEN CANVAS */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

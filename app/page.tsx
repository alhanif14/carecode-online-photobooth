"use client"

import { useState } from "react"
import Intro from "./components/Intro"
import Camera from "./components/Camera"
import Frame from "./components/Frame"

export default function Home() {
  const [step, setStep] = useState<"intro" | "camera" | "frame">("intro")
  const [photos, setPhotos] = useState<string[]>([])

  return (
    <main className="min-h-screen flex items-center justify-center">
      {step === "intro" && (
        <Intro onStart={() => setStep("camera")} />
      )}

      {step === "camera" && (
        <Camera
          onDone={(capturedPhotos) => {
            setPhotos(capturedPhotos)
            setStep("frame")
          }}
        />
      )}

      {step === "frame" && (
        <Frame photos={photos} />
      )}
    </main>
  )
}

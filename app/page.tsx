"use client"

import { useState } from "react"
import Intro from "./components/Intro"
import Camera from "./components/Camera"

export default function Home() {
  const [step, setStep] = useState<"intro" | "camera">("intro")

  return (
    <main className="min-h-screen flex items-center justify-center">
      {step === "intro" && (
        <Intro onStart={() => setStep("camera")} />
      )}

      {step === "camera" && <Camera />}
    </main>
  )
}

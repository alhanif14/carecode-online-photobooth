"use client"

import { useState } from "react"
import Intro from "./components/Intro"

export default function Home() {
  const [step, setStep] = useState<"intro" | "camera">("intro")

  return (
    <main className="min-h-screen flex items-center justify-center">
      {step === "intro" && (
        <Intro onStart={() => setStep("camera")} />
      )}

      {step === "camera" && (
        <p className="text-xl">Camera screen (coming soon)</p>
      )}
    </main>
  )
}

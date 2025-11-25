"use client"

export default function PlaygroundPage() {
  return (
    <iframe
      src="https://playground1-0.onrender.com"
      className="w-full"
      style={{ height: "100vh", border: "none" }}
      title="Medscribe Playground"
      allow="microphone; camera"
      allowFullScreen
    />
  )
}

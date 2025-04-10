'use client'
import { useState, useRef, useCallback, useEffect } from "react"
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { LuClipboardCheck } from "react-icons/lu";
import ReactMarkdown from "react-markdown"
import { FaCloudUploadAlt, FaMicrophone, FaStop } from "react-icons/fa";
import { FaFileMedical } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "../components/animated-section"
import { IoAlertCircleSharp } from "react-icons/io5";
import Link from "next/link"
import { BackgroundEffect } from "../components/background-effect"

export default function PrescriptionGenerator() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcription, setTranscription] = useState("")
  const [prescription, setPrescription] = useState("")
  const [transcriptionProgress, setTranscriptionProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setIsSuccess(false)
    setRecordedAudio(null)
    const file = e.target.files?.[0]

    if (!file) {
      resetFileInput()
      return
    }

    const validTypes = ["audio/mpeg", "audio/wav", "audio/m4a", "audio/ogg"]
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Please upload MP3, WAV, M4A, or OGG files.")
      resetFileInput()
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      setError("File too large. Maximum size is 25MB.")
      resetFileInput()
      return
    }

    setAudioFile(file)
    setTranscription("")
    setPrescription("")
  }

  const startRecording = async () => {
    try {
      setError(null)
      setIsSuccess(false)
      setTranscription("")
      setPrescription("")
      setAudioFile(null)
      resetFileInput()

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      setMediaRecorder(recorder)
      
      const chunks: Blob[] = []
      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setRecordedAudio(audioUrl)
        
        const audioFile = new File([audioBlob], "recording.wav", {
          type: "audio/wav",
        })
        setAudioFile(audioFile)
      }

      recorder.start(1000) // Collect data every second
      setIsRecording(true)
    } catch (error) {
      console.error("Recording error:", error)
      setError("Could not access microphone. Please check permissions.")
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [mediaRecorder])

  const transcribeAudio = async () => {
    if (!audioFile) {
      setError("Please select an audio file first")
      return
    }

    setIsTranscribing(true)
    setTranscription("")
    setPrescription("")
    setError(null)
    setIsSuccess(false)
    setTranscriptionProgress(0)

    try {
      const progressInterval = setInterval(() => {
        setTranscriptionProgress((prev) => Math.min(prev + 5, 90))
      }, 500)

      const formData = new FormData()
      formData.append("audio", audioFile)

      const response = await fetch("https://medscribe-backend.onrender.com/transcribe", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.detail || errorData?.message || errorData?.error || "Transcription failed")
      }

      const result = await response.json()

      if (!result.transcription) {
        throw new Error("No transcription returned from API")
      }

      clearInterval(progressInterval)
      setTranscriptionProgress(100)
      setTranscription(result.transcription)

      const prescriptionRes = await fetch("https://medscribe-backend.onrender.com/generate-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: result.transcription }),
      })

      if (!prescriptionRes.ok) {
        const errorData = await prescriptionRes.json().catch(() => null)
        throw new Error(errorData?.detail || errorData?.message || errorData?.error || "Prescription generation failed")
      }

      const prescriptionResult = await prescriptionRes.json()

      if (!prescriptionResult.prescription) {
        throw new Error("No prescription returned from API")
      }

      setPrescription(prescriptionResult.prescription)
      setIsSuccess(true)
    } catch (error) {
      console.error("Transcription error:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
      setIsSuccess(false)
    } finally {
      setIsTranscribing(false)
      setTranscriptionProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 relative overflow-hidden">
      <BackgroundEffect />

      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
              <div className="relative bg-gray-900 rounded-full p-2">
                <FaFileMedical />
              </div>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              MediScribe
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/careers" className="text-gray-300 hover:text-white transition-colors relative group">
              Careers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden relative overflow-hidden group">
            <span className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="sr-only">Open menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <main className="relative z-10">
        <AnimatedSection className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Generate Prescription from Audio
            </h1>

            {error && (
              <div className="bg-red-900/50 border border-red-800 rounded-xl p-4 mb-6 animate-fade-in">
                <div className="flex items-center gap-2 text-red-200">
                  <IoAlertCircleSharp />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {isSuccess && (
              <div className="bg-green-900/50 border border-green-800 rounded-xl p-4 mb-6 animate-fade-in">
                <div className="flex items-center gap-2 text-green-200">
                 <LuClipboardCheck />
                  <span>Prescription generated successfully!</span>
                </div>
              </div>
            )}

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-8 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300"></div>
              <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl">
                <div className="flex gap-4 mb-4">
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    variant={isRecording ? "destructive" : "outline"}
                    className="flex-1 gap-2"
                  >
                    {isRecording ? (
                      <>
                        <FaStop /> Stop Recording
                      </>
                    ) : (
                      <>
                        <FaMicrophone /> Record Audio
                      </>
                    )}
                  </Button>
                  <div className="relative flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="audio/mpeg,audio/wav,audio/m4a,audio/ogg"
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full gap-2"
                    >
                      <FaCloudUploadAlt /> Upload File
                    </Button>
                  </div>
                </div>

                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-red-400 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording in progress...</span>
                  </div>
                )}

                {recordedAudio && (
                  <div className="mb-4">
                    <audio src={recordedAudio} controls className="w-full" />
                  </div>
                )}

                {audioFile && (
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 mb-4 transform group-hover:translate-y-[-2px] transition-transform duration-300">
                    <div className="flex items-center gap-2 truncate">
                      <FaFileMedical />
                      <p className="text-gray-300 truncate">{audioFile.name}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setAudioFile(null)
                        setRecordedAudio(null)
                        setError(null)
                      }}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <FaXTwitter />
                    </button>
                  </div>
                )}

                {audioFile && (
                  <>
                    <Button
                      onClick={transcribeAudio}
                      disabled={isTranscribing}
                      className="mt-2 w-full max-w-xs mx-auto relative group"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative flex items-center justify-center gap-2">
                        {isTranscribing ? (
                          <>
                            <span className="animate-pulse">Processing...</span>
                          </>
                        ) : (
                          "Generate Prescription"
                        )}
                      </span>
                    </Button>

                    {isTranscribing && (
                      <div className="mt-4 w-full max-w-xs mx-auto space-y-2">
                        <div className="bg-gray-800 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${transcriptionProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-400">{transcriptionProgress}% complete</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {isTranscribing && !transcription && (
              <div className="text-center py-8 space-y-4">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                <p className="text-blue-400 animate-pulse">Processing your audio... {transcriptionProgress}%</p>
              </div>
            )}

            {transcription && prescription && (
              <div className="relative group animate-fade-in">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-50 group-hover:opacity-100 blur-sm group-hover:blur transition duration-300"></div>
                <div className="relative bg-gray-900/80 backdrop-blur-sm p-6 rounded-xl transform group-hover:translate-y-[-5px] transition-all duration-300">
                  <h2 className="text-2xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                    Your Prescription
                  </h2>
                  <div className="prose prose-invert prose-headings:text-purple-300 prose-strong:text-blue-300 prose-em:text-gray-300 max-w-none bg-gray-800/40 p-6 rounded-lg border border-gray-700 shadow-inner">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-4">
                            <table className="w-full border-collapse" {...props} />
                          </div>
                        ),
                        thead: ({ node, ...props }) => <thead className="bg-gray-800" {...props} />,
                        th: ({ node, ...props }) => (
                          <th
                            className="border border-gray-700 px-4 py-2 text-left font-medium text-purple-300"
                            {...props}
                          />
                        ),
                        td: ({ node, ...props }) => <td className="border border-gray-700 px-4 py-2" {...props} />,
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 my-4"
                            {...props}
                          />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3" {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 className="text-lg font-medium text-purple-300 mt-4 mb-2" {...props} />
                        ),
                      }}
                    >
                      {prescription}
                    </ReactMarkdown>
                    <div className="flex gap-3 mt-6">
                      <Button
                        className="flex-1 relative group"
                        onClick={() => navigator.clipboard.writeText(prescription)}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative">Copy Prescription</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 relative group"
                        onClick={() => {
                          const blob = new Blob([prescription], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = 'prescription.txt'
                          a.click()
                        }}
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative">Download as TXT</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
                <div className="relative bg-gray-900 rounded-full p-2">
                 <FaFileMedical />
                </div>
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                MediScribe
              </span>
            </div>
            <div className="flex space-x-4">
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                <FaXTwitter />
                </div>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                 <FaLinkedin />
                </div>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                 <FaGithub />
                </div>
                <span className="sr-only">GitHub</span>
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center md:text-left">
            <p className="text-gray-500 text-sm">&copy; {new Date().getFullYear()} MediScribe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

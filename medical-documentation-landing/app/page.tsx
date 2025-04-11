import Link from "next/link"
import type { Metadata } from "next"
import { Github, Keyboard, Linkedin, Twitter, UserMinus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingCta } from "./components/floating-cta"
import { AnimatedSection } from "./components/animated-section"
import { BackgroundEffect } from "./components/background-effect"

export const metadata: Metadata = {
  title: "MediScribe - AI-powered Prescription Documentation",
  description:
    "Re-imagine the way prescriptions are documented with our AI-powered solution for medical professionals.",
  keywords: "medical documentation, AI, healthcare, prescriptions, doctors",
}

export default function Home() {
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
                <img src="/logo.png" alt="MediScribe Logo" className="h-10 w-19" />
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
        {/* Hero Section */}
        <AnimatedSection className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-blue-400 font-medium mb-4 animate-pulse">
              Re-imagine the way prescriptions are documented!
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              AI-powered solution for effortless prescription documentation for medical professionals!
            </h1>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <Link
  href="https://docs.google.com/forms/d/1mI-EOufdnqRe5JCaKX21MQRahkymzLRceAnqernYiqI/viewform?edit_requested=true"
  target="_blank"
  rel="noopener noreferrer"
  passHref
>
  <Button className="relative group px-10 py-7 h-auto rounded-xl border-0 overflow-hidden">
    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 transition-all duration-300 group-hover:from-blue-600 group-hover:via-indigo-600 group-hover:to-blue-700 group-hover:scale-[1.02]" />
    <span className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] transition-opacity duration-500" />
    <span className="relative flex flex-col items-center">
      <span className="text-lg font-bold tracking-wide">Join Waitlist</span>
      <span className="text-xs opacity-90 mt-1">No cost, priority access</span>
    </span>
  </Button>
</Link>

              
              <Link href="/pricing" passHref>
                <Button className="relative group px-10 py-7 h-auto rounded-xl border-0 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 transition-all duration-300 group-hover:from-emerald-600 group-hover:via-teal-600 group-hover:to-emerald-700 group-hover:scale-[1.02]"></span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] transition-opacity duration-500"></span>
                  <span className="relative flex flex-col items-center">
                    <span className="text-lg font-bold tracking-wide">Try Now</span>
                    <span className="text-xs opacity-90 mt-1">Beta access</span>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Rest of your existing code... */}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-sm py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
                <div className="relative bg-gray-900 rounded-full p-2">
                  <img src="/logo.png" alt="MediScribe Logo" className="h-10 w-19" />
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
                  <Twitter className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                  <Linkedin className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="relative group p-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition duration-200"></div>
                <div className="relative bg-gray-800 group-hover:bg-gray-900 p-2 rounded-full transition-colors">
                  <Github className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
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

      {/* Floating CTA for mobile */}
      <FloatingCta />
    </div>
  )
}

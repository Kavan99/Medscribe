"use client"

import Link from "next/link"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedSection } from "./animated-section" // Keep your animated section separate

export function Header() {
  return (
    <header className="container mx-auto px-4 py-6 relative z-10">
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm group-hover:blur transition duration-200"></div>
            <div className="relative bg-gray-900 rounded-full p-2">
              <FileText className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
            </div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            MediScribe
          </span>
        </Link>
        
        {/* Navigation - This is where to add your nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/careers" className="text-gray-300 hover:text-white transition-colors relative group">
            Careers
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/prescription" className="text-blue-400 font-medium hover:text-blue-300 transition-colors relative group">
            Generate Prescription
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
  )
}
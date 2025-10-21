"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function FloatingCta() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-6 md:hidden transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-70 group-hover:opacity-100 blur group-hover:blur-lg transition duration-200"></div>
        <Button className="relative bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg border-0">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 font-medium">
            Join Waitlist
          </span>
        </Button>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import Image from "next/image"

export default function HomeClient() {
  const [user, setUser] = useState<User | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      console.log("User Session:", session?.user) // Debug log
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      console.log("Auth State Change:", session?.user) // Debug log
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors relative group">
            About Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/careers" className="text-gray-300 hover:text-white transition-colors relative group">
            Careers
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors relative group">
            Pricing
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          {user ? (
            <Link href="/profile" className="flex items-center space-x-2">
              <Image
                src={user.user_metadata.avatar_url || "/default-avatar.png"}
                alt={`${user.user_metadata.full_name || user.email || "User"}'s Avatar`}
                width={40}
                height={40}
                className="rounded-full border-2 border-blue-400"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
              <span className="text-gray-300 text-sm">
                {user.user_metadata.full_name || user.email || "User"}
              </span>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="text-gray-300 border-gray-300 hover:bg-gray-800">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden relative overflow-hidden group"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="md:hidden mt-4 flex flex-col space-y-4 bg-gray-900/90 backdrop-blur-sm p-4 rounded-lg">
          <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
            About Us
          </Link>
          <Link href="/careers" className="text-gray-300 hover:text-white transition-colors">
            Careers
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>
          {user ? (
            <Link href="/profile" className="flex items-center space-x-2">
              <Image
                src={user.user_metadata.avatar_url || "/default-avatar.png"}
                alt={`${user.user_metadata.full_name || user.email || "User"}'s Avatar`}
                width={32}
                height={32}
                className="rounded-full border-2 border-blue-400"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/default-avatar.png";
                }}
              />
              <span className="text-gray-300">{user.user_metadata.full_name || user.email || "User"}</span>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full text-gray-300 border-gray-300 hover:bg-gray-800">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import Image from "next/image"

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fetch the current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error("Error fetching session:", error)
      setLoading(false)
    })

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Cleanup subscription
    return () => subscription.unsubscribe()
  }, [])

  // Redirect to login only after loading, if no user
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [loading, user, router])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setUser(null)
      router.push("/") // Redirect to home page after logout
    }
  }

  // Show loading state while fetching session
  if (loading) {
    return <div className="container mx-auto px-4 py-16 text-center text-gray-100">Loading...</div>
  }

  // Redirect handled in useEffect, so this renders only if user exists
  if (!user) {
    return null // Should not reach here due to useEffect redirect
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-100 mb-6">Profile</h1>
      <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={user.user_metadata.avatar_url || "/default-avatar.png"}
            alt={`${user.user_metadata.full_name || user.email || "User"}'s Avatar`}
            width={80}
            height={80}
            className="rounded-full border-2 border-blue-400"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/default-avatar.png";
            }}
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-100">
              {user.user_metadata.full_name || user.email || "User"}
            </h2>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

// app/auth/callback/page.tsx

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data.session) {
        router.push("/dashboard")
      } else {
        router.push("/auth/login")
      }
    }
    handleAuth()
  }, [router])

  return <div className="p-6">Logging you in...</div>
}

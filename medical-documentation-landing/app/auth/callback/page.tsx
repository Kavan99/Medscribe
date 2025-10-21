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
        router.push("/") // ✅ redirect to homepage
      } else {
        router.push("/auth/login") // optional: you could add error query param here
      }
    }

    handleAuth()
  }, [router])

  return <div className="p-6">Logging you in...</div>
}



'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Music2, Lock, Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        setError('Invalid email or password. Please try again.')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 bg-navy/5">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy mx-auto mb-3">
            <Music2 className="h-7 w-7 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-navy">Admin Login</h1>
          <p className="text-navy/60 mt-1">Sign in to the StateMentor admin panel</p>
        </div>

        <div className="rounded-2xl border border-navy/10 bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                autoFocus
              />
              <Mail className="absolute right-3 top-9 h-4 w-4 text-navy/30 pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
              <Lock className="absolute right-3 top-9 h-4 w-4 text-navy/30 pointer-events-none" />
            </div>

            {error && (
              <div className="rounded-lg bg-burgundy/10 border border-burgundy/20 p-3 text-sm text-burgundy">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </main>
  )
}

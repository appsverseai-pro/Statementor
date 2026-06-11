'use client'

import { useState, FormEvent } from 'react'
import Input, { Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function MentorApplicationForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [instrument, setInstrument] = useState('')
  const [school, setSchool] = useState('')
  const [yearsInAllState, setYearsInAllState] = useState('1')
  const [why, setWhy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/mentor-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          instrument,
          school,
          yearsInAllState: Number(yearsInAllState),
          why,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-gold/30 bg-white p-8 text-center shadow-sm">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-navy mb-2">Application received!</h3>
        <p className="text-navy/65">
          Thanks for applying, {name.split(' ')[0] || 'friend'}! We review applications on a
          rolling basis and will get back to you at <span className="font-semibold">{email}</span>{' '}
          within 48 hours.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-navy/10 bg-white p-6 sm:p-8 shadow-sm space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Jordan Lee"
          required
        />
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <Input
          label="Instrument"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
          placeholder="Violin, Trumpet, Voice..."
          required
        />
        <Input
          label="School"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="Lincoln High School"
          required
        />
      </div>
      <Input
        label="Years in All State"
        type="number"
        min={1}
        max={10}
        value={yearsInAllState}
        onChange={(e) => setYearsInAllState(e.target.value)}
        required
      />
      <Textarea
        label="Why do you want to mentor?"
        value={why}
        onChange={(e) => setWhy(e.target.value)}
        placeholder="Tell us why you want to help other students make All State..."
        rows={5}
        required
        minLength={10}
      />
      {error && (
        <p className="rounded-lg bg-burgundy/10 px-4 py-3 text-sm text-burgundy">{error}</p>
      )}
      <Button type="submit" size="lg" loading={loading} className="w-full">
        Submit Application
      </Button>
    </form>
  )
}

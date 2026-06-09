'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Mentor } from '@/lib/google-sheets'
import { formatCurrency, formatDate } from '@/lib/utils'
import TimeSlotPicker from './TimeSlotPicker'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Calendar, Clock, User, Mail, Music } from 'lucide-react'

const bookingSchema = z.object({
  studentName: z.string().min(2, 'Name must be at least 2 characters'),
  studentEmail: z.string().email('Please enter a valid email'),
  studentInstrument: z.string().min(2, 'Please enter your instrument'),
  sessionGoals: z.string().optional(),
  sessionLength: z.enum(['30', '60']),
})

type BookingFormData = z.infer<typeof bookingSchema>

interface BookingFormProps {
  mentor: Mentor
}

export default function BookingForm({ mentor }: BookingFormProps) {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      sessionLength: '60',
    },
  })

  const sessionLength = parseInt(watch('sessionLength') ?? '60', 10)
  const price = sessionLength === 30 ? mentor.sessionPrice / 2 : mentor.sessionPrice

  const onSubmit = async (data: BookingFormData) => {
    if (!selectedDate) {
      setError('Please select a date and time for your session.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mentorId: mentor.id,
          studentName: data.studentName,
          studentEmail: data.studentEmail,
          studentInstrument: data.studentInstrument,
          sessionGoals: data.sessionGoals,
          sessionLength: parseInt(data.sessionLength, 10),
          sessionDate: selectedDate.toISOString(),
        }),
      })

      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Failed to create booking')
      }

      const { bookingId } = await res.json()

      // Proceed to checkout
      const checkoutRes = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          mentorName: mentor.name,
          instrument: mentor.instrument,
          sessionLength: parseInt(data.sessionLength, 10),
          price,
          studentEmail: data.studentEmail,
        }),
      })

      if (!checkoutRes.ok) {
        const body = await checkoutRes.json()
        throw new Error(body.error ?? 'Failed to create checkout session')
      }

      const { url } = await checkoutRes.json()
      router.push(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step 1: Select date */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
          <Calendar className="h-5 w-5 text-gold" />
          Select Date & Time
        </h3>
        <TimeSlotPicker
          availableDays={mentor.availableDays}
          availableTimes={mentor.availableTimes}
          onSelect={setSelectedDate}
          selectedDate={selectedDate}
        />
        {selectedDate && (
          <p className="mt-3 text-sm text-gold font-medium">
            Selected: {formatDate(selectedDate)}
          </p>
        )}
      </div>

      {/* Step 2: Session length */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
          <Clock className="h-5 w-5 text-gold" />
          Session Length
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {(['30', '60'] as const).map((len) => {
            const p = len === '30' ? mentor.sessionPrice / 2 : mentor.sessionPrice
            const isSelected = watch('sessionLength') === len
            return (
              <label
                key={len}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-gold bg-gold/5'
                    : 'border-navy/20 hover:border-gold/50'
                }`}
              >
                <input
                  type="radio"
                  value={len}
                  {...register('sessionLength')}
                  className="sr-only"
                />
                <span className="text-xl font-bold text-navy">{len} min</span>
                <span className="text-gold font-semibold">{formatCurrency(p)}</span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Step 3: Student info */}
      <div className="rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-navy mb-4">
          <User className="h-5 w-5 text-gold" />
          Your Information
        </h3>
        <div className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Your full name"
            required
            error={errors.studentName?.message}
            {...register('studentName')}
          />
          <div className="relative">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              required
              error={errors.studentEmail?.message}
              {...register('studentEmail')}
            />
          </div>
          <div className="relative">
            <Input
              label="Your Instrument"
              placeholder="e.g. Violin, Trumpet, Voice"
              required
              error={errors.studentInstrument?.message}
              {...register('studentInstrument')}
            />
          </div>
          <Textarea
            label="Session Goals"
            placeholder="What do you hope to work on? (audition prep, technique, sight-reading...)"
            rows={3}
            hint="Optional but helps your mentor prepare"
            error={errors.sessionGoals?.message}
            {...register('sessionGoals')}
          />
        </div>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-4">
        <div className="flex justify-between text-sm">
          <span className="text-navy/70">Session with {mentor.name}</span>
          <span className="font-bold text-navy">{formatCurrency(price)}</span>
        </div>
        {selectedDate && (
          <div className="flex justify-between text-sm mt-1.5">
            <span className="text-navy/70">Date & Time</span>
            <span className="font-medium text-navy text-right">{formatDate(selectedDate)}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg bg-burgundy/10 border border-burgundy/20 p-3 text-sm text-burgundy">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={isSubmitting}
        disabled={!selectedDate}
      >
        Continue to Payment — {formatCurrency(price)}
      </Button>
    </form>
  )
}

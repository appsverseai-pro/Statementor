'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TimeSlotPickerProps {
  availableDays: string[]
  availableTimes: string[]
  onSelect: (date: Date) => void
  selectedDate?: Date
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i)
  if (!match) return { hours: 0, minutes: 0 }
  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3]?.toUpperCase()
  if (period === 'PM' && hours !== 12) hours += 12
  if (period === 'AM' && hours === 12) hours = 0
  return { hours, minutes }
}

export default function TimeSlotPicker({
  availableDays,
  availableTimes,
  onSelect,
  selectedDate,
}: TimeSlotPickerProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [pickedDay, setPickedDay] = useState<Date | null>(null)

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const isAvailableDay = (date: Date) => {
    const dayName = DAYS_OF_WEEK[date.getDay()]
    return availableDays.includes(dayName)
  }

  const isPast = (date: Date) => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    const t = new Date()
    t.setHours(0, 0, 0, 0)
    return d < t
  }

  const selectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    if (isPast(date) || !isAvailableDay(date)) return
    setPickedDay(date)
  }

  const selectTime = (timeStr: string) => {
    if (!pickedDay) return
    const { hours, minutes } = parseTime(timeStr)
    const date = new Date(pickedDay)
    date.setHours(hours, minutes, 0, 0)
    onSelect(date)
  }

  const isSelectedDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day)
    return pickedDay?.toDateString() === date.toDateString()
  }

  const isSelectedDateTime = (timeStr: string) => {
    if (!selectedDate || !pickedDay) return false
    const { hours, minutes } = parseTime(timeStr)
    return (
      selectedDate.toDateString() === pickedDay.toDateString() &&
      selectedDate.getHours() === hours &&
      selectedDate.getMinutes() === minutes
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/10 hover:text-navy transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h3 className="font-semibold text-navy text-sm">
            {MONTHS[viewMonth]} {viewYear}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-lg p-1.5 text-navy/60 hover:bg-navy/10 hover:text-navy transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d} className="text-xs font-semibold text-navy/40 py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const date = new Date(viewYear, viewMonth, day)
            const available = isAvailableDay(date) && !isPast(date)
            const selected = isSelectedDay(day)

            return (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                disabled={!available}
                className={cn(
                  'rounded-lg py-2 text-sm font-medium transition-colors',
                  selected
                    ? 'bg-gold text-white'
                    : available
                    ? 'text-navy hover:bg-gold/15 hover:text-gold'
                    : 'text-navy/20 cursor-not-allowed'
                )}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {pickedDay && (
        <div>
          <h4 className="text-sm font-semibold text-navy mb-3">
            Available Times for {pickedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => selectTime(time)}
                className={cn(
                  'rounded-lg border py-2 text-sm font-medium transition-colors',
                  isSelectedDateTime(time)
                    ? 'border-gold bg-gold text-white'
                    : 'border-navy/20 text-navy hover:border-gold hover:text-gold'
                )}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

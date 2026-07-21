'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Input, Textarea } from '@/components/ui/Input'
import type { Mentor } from '@/lib/google-sheets'
import { Plus, Pencil, X, Save } from 'lucide-react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TIMES = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM']

const emptyMentor: Partial<Mentor> = {
  name: '',
  instrument: '',
  school: '',
  bio: '',
  yearsInAllState: 1,
  achievements: '',
  teachingAreas: '',
  sessionPrice: 60,
  profilePhoto: '',
  availableDays: [],
  availableTimes: [],
  email: '',
  active: true,
}

export default function AdminMentorsPage() {
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Mentor | null>(null)
  const [formData, setFormData] = useState<Partial<Mentor>>(emptyMentor)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const fetchMentors = useCallback(async () => {
    const res = await fetch('/api/admin/mentors')
    if (res.status === 401) {
      router.push('/admin/login')
      return
    }
    const data = await res.json()
    setMentors(data)
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchMentors()
  }, [fetchMentors])

  const startEdit = (mentor: Mentor) => {
    setEditing(mentor)
    setFormData({ ...mentor })
    setShowForm(true)
    setError(null)
  }

  const startCreate = () => {
    setEditing(null)
    setFormData({ ...emptyMentor })
    setShowForm(true)
    setError(null)
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditing(null)
    setFormData(emptyMentor)
    setError(null)
  }

  const toggleDay = (day: string) => {
    const days = formData.availableDays ?? []
    setFormData((prev) => ({
      ...prev,
      availableDays: days.includes(day) ? days.filter((d) => d !== day) : [...days, day],
    }))
  }

  const toggleTime = (time: string) => {
    const times = formData.availableTimes ?? []
    setFormData((prev) => ({
      ...prev,
      availableTimes: times.includes(time) ? times.filter((t) => t !== time) : [...times, time],
    }))
  }

  // Read an uploaded image, downscale it (keeping any aspect ratio) and store
  // it as a base64 data URL in profilePhoto. Keeping the longest side at 800px
  // keeps the payload small enough to save straight into the mentors table.
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    setPhotoUploading(true)
    setError(null)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Could not read file'))
        reader.readAsDataURL(file)
      })

      const resized = await new Promise<string>((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const maxSide = 800
          let { width, height } = img
          if (width > maxSide || height > maxSide) {
            const scale = maxSide / Math.max(width, height)
            width = Math.round(width * scale)
            height = Math.round(height * scale)
          }
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (!ctx) return reject(new Error('Canvas not supported'))
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        }
        img.onerror = () => reject(new Error('Could not load image'))
        img.src = dataUrl
      })

      setFormData((p) => ({ ...p, profilePhoto: resized }))
    } catch {
      setError('Could not process that image. Try a different file.')
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch('/api/admin/mentors', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? 'Failed to save')
      }
      await fetchMentors()
      cancelForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save mentor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Mentors</h1>
            <p className="text-navy/60 mt-0.5">{mentors.length} total mentors</p>
          </div>
          <Button onClick={startCreate} size="md">
            <Plus className="h-4 w-4 mr-2" />
            Add Mentor
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-navy text-lg">
                {editing ? 'Edit Mentor' : 'New Mentor'}
              </h2>
              <button onClick={cancelForm} className="text-navy/40 hover:text-navy">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={formData.name ?? ''}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <Input
                label="Instrument"
                value={formData.instrument ?? ''}
                onChange={(e) => setFormData((p) => ({ ...p, instrument: e.target.value }))}
                required
              />
              <Input
                label="School"
                value={formData.school ?? ''}
                onChange={(e) => setFormData((p) => ({ ...p, school: e.target.value }))}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email ?? ''}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                required
              />
              <Input
                label="Years in All-State"
                type="number"
                min={1}
                value={formData.yearsInAllState ?? 1}
                onChange={(e) => setFormData((p) => ({ ...p, yearsInAllState: parseInt(e.target.value) }))}
              />
              <Input
                label="Session Price ($/hr)"
                type="number"
                min={0}
                step={5}
                value={formData.sessionPrice ?? 60}
                onChange={(e) => setFormData((p) => ({ ...p, sessionPrice: parseFloat(e.target.value) }))}
              />
              {/* Profile photo upload */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-navy block mb-2">Profile Photo</label>
                <div className="flex items-center gap-4">
                  {formData.profilePhoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.profilePhoto}
                      alt="Mentor preview"
                      className="h-20 w-20 rounded-full object-cover ring-2 ring-gold/30"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-navy/10 text-navy/40 text-xs text-center">
                      No photo
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-navy/10 px-4 py-2 text-sm font-medium text-navy hover:bg-navy/20 transition-colors w-fit">
                      {photoUploading ? 'Processing...' : 'Upload Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={photoUploading}
                        className="hidden"
                      />
                    </label>
                    {formData.profilePhoto && (
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, profilePhoto: '' }))}
                        className="text-xs text-burgundy hover:underline w-fit"
                      >
                        Remove photo
                      </button>
                    )}
                    <p className="text-xs text-navy/50">Any shape or size works — we resize it for you.</p>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <Textarea
                  label="Bio"
                  value={formData.bio ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Achievements"
                  value={formData.achievements ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, achievements: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Input
                  label="Teaching Areas (comma separated)"
                  value={formData.teachingAreas ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, teachingAreas: e.target.value }))}
                />
              </div>

              {/* Available days */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-navy block mb-2">Available Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        formData.availableDays?.includes(day)
                          ? 'bg-gold text-white'
                          : 'bg-navy/10 text-navy hover:bg-navy/20'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available times */}
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-navy block mb-2">Available Times</label>
                <div className="flex flex-wrap gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleTime(time)}
                      className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                        formData.availableTimes?.includes(time)
                          ? 'bg-gold text-white'
                          : 'bg-navy/10 text-navy hover:bg-navy/20'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active ?? true}
                    onChange={(e) => setFormData((p) => ({ ...p, active: e.target.checked }))}
                    className="h-4 w-4 rounded border-navy/30 text-gold focus:ring-gold"
                  />
                  <span className="text-sm font-medium text-navy">Active (visible to students)</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-lg bg-burgundy/10 border border-burgundy/20 p-3 text-sm text-burgundy">
                {error}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              <Button onClick={handleSave} loading={saving}>
                <Save className="h-4 w-4 mr-2" />
                {editing ? 'Save Changes' : 'Create Mentor'}
              </Button>
              <Button variant="outline" onClick={cancelForm}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Mentors table */}
        {loading ? (
          <div className="text-center py-12 text-navy/40">Loading mentors...</div>
        ) : (
          <div className="rounded-xl border border-navy/10 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-navy/5 border-b border-navy/10">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-navy/70">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy/70">Instrument</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy/70">School</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy/70">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-navy/70">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-navy/70">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {mentors.map((mentor) => (
                  <tr key={mentor.id} className="hover:bg-navy/2">
                    <td className="px-4 py-3 font-medium text-navy">{mentor.name}</td>
                    <td className="px-4 py-3 text-navy/70">{mentor.instrument}</td>
                    <td className="px-4 py-3 text-navy/70">{mentor.school}</td>
                    <td className="px-4 py-3 text-navy/70">${mentor.sessionPrice}/hr</td>
                    <td className="px-4 py-3">
                      <Badge variant={mentor.active ? 'green' : 'gray'}>
                        {mentor.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(mentor)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-navy/60 hover:bg-navy/10 hover:text-navy transition-colors"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

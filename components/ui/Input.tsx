import { cn } from '@/lib/utils'
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, hint, id, ...props },
  ref
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-navy">
          {label}
          {props.required && <span className="ml-1 text-burgundy">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn(
          'rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40',
          'focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
          'disabled:cursor-not-allowed disabled:bg-navy/5 disabled:opacity-60',
          error && 'border-burgundy focus:border-burgundy focus:ring-burgundy/20',
          className
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-navy/60">{hint}</p>}
      {error && <p className="text-xs text-burgundy">{error}</p>}
    </div>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, label, error, hint, id, rows = 4, ...props }, ref) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-navy">
            {label}
            {props.required && <span className="ml-1 text-burgundy">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={cn(
            'rounded-lg border border-navy/20 bg-white px-4 py-2.5 text-navy placeholder:text-navy/40',
            'focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
            'disabled:cursor-not-allowed disabled:bg-navy/5 disabled:opacity-60 resize-none',
            error && 'border-burgundy focus:border-burgundy focus:ring-burgundy/20',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-navy/60">{hint}</p>}
        {error && <p className="text-xs text-burgundy">{error}</p>}
      </div>
    )
  }
)

export default Input

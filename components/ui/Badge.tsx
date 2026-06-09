import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'gold' | 'navy' | 'burgundy' | 'green' | 'gray'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-navy/10 text-navy',
  gold: 'bg-gold/15 text-gold',
  navy: 'bg-navy text-cream',
  burgundy: 'bg-burgundy/15 text-burgundy',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-700',
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

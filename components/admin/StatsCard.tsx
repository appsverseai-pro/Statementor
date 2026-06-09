import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: { value: number; label: string }
  variant?: 'default' | 'gold' | 'burgundy'
}

const variantStyles = {
  default: 'bg-white border-navy/10',
  gold: 'bg-gold/5 border-gold/20',
  burgundy: 'bg-burgundy/5 border-burgundy/20',
}

const iconStyles = {
  default: 'bg-navy/10 text-navy',
  gold: 'bg-gold/15 text-gold',
  burgundy: 'bg-burgundy/15 text-burgundy',
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  return (
    <div className={cn('rounded-xl border p-5 shadow-sm', variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-navy/60">{title}</p>
          <p className="text-3xl font-bold text-navy mt-1">{value}</p>
          {description && (
            <p className="text-xs text-navy/50 mt-1">{description}</p>
          )}
        </div>
        <div className={cn('rounded-xl p-2.5', iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span
            className={cn(
              'text-xs font-semibold',
              trend.value >= 0 ? 'text-green-600' : 'text-burgundy'
            )}
          >
            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-navy/40">{trend.label}</span>
        </div>
      )}
    </div>
  )
}

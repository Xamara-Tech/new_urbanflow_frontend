'use client'

import { useEffect, useState } from 'react'
import { Building2, Users, MapPin, TrendingUp } from 'lucide-react'

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const icons = [Building2, Users, MapPin, TrendingUp]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((Icon, index) => (
        <div
          key={index}
          className={`absolute animate-float opacity-10 dark:opacity-5`}
          style={{
            left: `${20 + index * 20}%`,
            top: `${10 + index * 15}%`,
            animationDelay: `${index * 0.5}s`,
            animationDuration: `${4 + index}s`,
          }}
        >
          <Icon className="w-16 h-16 text-primary" />
        </div>
      ))}
    </div>
  )
}

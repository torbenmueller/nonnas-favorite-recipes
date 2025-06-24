'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface CardImageProps {
  src: string
  alt: string
  className?: string
}

export function CardImage({ src, alt, className }: CardImageProps) {
  return (
    <div className={cn('relative aspect-[16/9] w-full overflow-hidden rounded-t-lg', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        className="object-cover"
      />
    </div>
  )
}

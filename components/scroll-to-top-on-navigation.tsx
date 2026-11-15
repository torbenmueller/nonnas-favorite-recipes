"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

let scrollAfterNavigation = false

export function scrollToTopOnNextNavigation() {
  scrollAfterNavigation = true
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  })
}

export function ScrollToTopOnBack() {
  const pathname = usePathname()

  useEffect(() => {
    if (!scrollAfterNavigation) return
    scrollAfterNavigation = false

    const frame = requestAnimationFrame(scrollToTop)
    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}

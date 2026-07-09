'use client'

import { useEffect } from 'react'

/**
 * Adds an IntersectionObserver that adds the class 'visible' to
 * elements with class 'animate-on-scroll' when they enter the viewport.
 */
export function useScrollAnimation() {
  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

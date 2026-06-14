import { useEffect } from 'react'

// Adds the `in` class to .reveal elements as they scroll into view.
// Re-runs whenever `dep` changes (e.g. route / filter change).
export default function useReveal(dep) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    els.forEach((el) => io.observe(el))
    // Reveal anything already in view on mount
    const t = setTimeout(() => {
      els.forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight - 40) el.classList.add('in')
      })
    }, 100)
    return () => {
      io.disconnect()
      clearTimeout(t)
    }
  }, [dep])
}

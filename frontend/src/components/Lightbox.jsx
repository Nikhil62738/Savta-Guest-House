import { useEffect } from 'react'

// Simple accessible lightbox overlay. `item` = { src, label, type } or null.
export default function Lightbox({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    if (item) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-navy/95 backdrop-blur p-6 animate-pageIn"
      onClick={onClose}
    >
      <button
        aria-label="Close"
        className="absolute top-6 right-8 text-white/80 hover:text-gold text-4xl leading-none"
      >
        &times;
      </button>
      <figure className="max-w-5xl w-full animate-popIn" onClick={(e) => e.stopPropagation()}>
        {item.type === 'video' ? (
          <video src={item.src} controls autoPlay className="w-full max-h-[80vh] rounded-xl2" />
        ) : (
          <img src={item.src} alt={item.label || ''} className="w-full max-h-[80vh] object-contain rounded-xl2" />
        )}
        {item.label && <figcaption className="text-center text-gold-light mt-4 tracking-wide">{item.label}</figcaption>}
      </figure>
    </div>
  )
}

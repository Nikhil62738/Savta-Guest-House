import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext.jsx'

// Room card with a multi-image carousel, price, amenities and a Book Now CTA.
export default function RoomCard({ room, onImageClick }) {
  const { t } = useLang()
  const [idx, setIdx] = useState(0)
  const images = room.images || []
  const description = room.desc || room.description || ''
  const amenities = room.amenities || []
  const totalUnits = room.totalUnits
  const available = totalUnits != null
    ? Math.max(0, Number(totalUnits) - Number(room.bookedOnline || 0) - Number(room.bookedOffline || 0))
    : null
  const soldOut = available === 0
  const rt = roomRating(room)
  const go = (n) => setIdx((i) => (i + n + images.length) % images.length)

  return (
    <article className="group bg-white rounded-xl2 overflow-hidden shadow-sm2 hover:shadow-card transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-full">
      <div className="relative h-60 overflow-hidden">
        <img
          src={images[idx]}
          alt={room.name}
          loading="lazy"
          onClick={() => onImageClick && onImageClick({ src: images[idx], label: room.name })}
          className="w-full h-full transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
        />
        <span className="absolute top-4 left-4 bg-navy/85 text-gold-light text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur">
          {t(room.category + ' Room') !== room.category + ' Room' ? t(room.category + ' Room') : room.category}
        </span>
        {images.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous" className="absolute top-1/2 left-3 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full bg-white/85 hover:bg-gold text-navy opacity-0 group-hover:opacity-100 transition-opacity">‹</button>
            <button onClick={() => go(1)} aria-label="Next" className="absolute top-1/2 right-3 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full bg-white/85 hover:bg-gold text-navy opacity-0 group-hover:opacity-100 transition-opacity">›</button>
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
              {images.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-gold' : 'bg-white/60'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-xl text-navy font-semibold">{t(room.name)}</h3>
          <div className="text-right shrink-0">
            <span className="block text-gold-dark font-bold text-lg">₹{Number(room.price || 0).toLocaleString('en-IN')}</span>
            <span className="text-xs text-graytxt">{t('/ night')}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-gold text-base leading-none">★</span>
          <span className="text-sm font-bold text-navy">{rt.rating}</span>
          <span className="text-xs text-graytxt">({rt.reviews} {t('Reviews')})</span>
        </div>
        <p className="text-sm text-graytxt mt-2 leading-relaxed">{description}</p>

        <ul className="flex flex-wrap gap-2 mt-4">
          {amenities.map((a) => (
            <li key={a} className="text-xs bg-beige text-charcoal px-2.5 py-1 rounded-full">{t(a)}</li>
          ))}
        </ul>

        {available != null && (
          <div className="mt-4">
            {soldOut ? (
              <span className="text-xs font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">{t('Sold Out')}</span>
            ) : (
              <span className="text-xs font-semibold bg-green-50 text-green-600 px-2.5 py-1 rounded-full">{available} {available > 1 ? t('rooms available') : t('room available')}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-5 border-t border-black/5">
          <span className="text-sm text-graytxt">👥 {room.occupancy}</span>
          {soldOut ? (
            <span className="btn btn-navy !py-2.5 !px-5 text-sm opacity-50 cursor-not-allowed">{t('Sold Out')}</span>
          ) : (
            <Link to="/booking" state={bookingState(room)} className="btn btn-navy !py-2.5 !px-5 text-sm">
              {t('Book Now')}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

function bookingState(room) {
  return { roomId: room._id, roomType: room.category }
}

// Deterministic display rating + review count when the backend doesn't provide one.
export function roomRating(room) {
  if (room.rating != null) {
    return { rating: Number(room.rating), reviews: room.reviewsCount || room.reviews || 0 }
  }
  const key = String(room._id || room.id || room.name || 'room')
  let h = 0
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 100000
  return { rating: Number((4.5 + (h % 5) / 10).toFixed(1)), reviews: 80 + (h % 150) }
}

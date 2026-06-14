import { useEffect, useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import RoomCard, { roomRating } from '../components/RoomCard.jsx'
import RoomCardSkeleton from '../components/RoomCardSkeleton.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { ROOMS, ROOM_TYPES } from '../data/site.js'
import api from '../lib/api.js'

export default function Rooms() {
  const { t } = useLang()
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('recommended')
  const [box, setBox] = useState(null)
  const [rooms, setRooms] = useState(ROOMS)
  const [loading, setLoading] = useState(true)

  // Re-run the reveal animation whenever the filter changes OR rooms finish
  // loading, so freshly-rendered cards are revealed (fixes “invisible until click”).
  useReveal(filter + '|' + loading + '|' + rooms.length)

  // Try to load live rooms from the API; fall back to bundled data.
  useEffect(() => {
    let active = true
    api
      .get('/rooms')
      .then((res) => {
        const data = res?.data?.rooms || res?.data
        if (active && Array.isArray(data) && data.length) setRooms(data)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const cats = ['All', ...ROOM_TYPES]
  const base = filter === 'All' ? rooms : rooms.filter((r) => r.category === filter)
  const shown = [...base]
  if (sort === 'priceLow') shown.sort((a, b) => (a.price || 0) - (b.price || 0))
  else if (sort === 'priceHigh') shown.sort((a, b) => (b.price || 0) - (a.price || 0))
  else if (sort === 'popular') shown.sort((a, b) => roomRating(b).reviews - roomRating(a).reviews)

  return (
    <>
      <Seo title="Rooms & Suites" description="Standard, Deluxe, Family, AC and Non-AC rooms at Sawta Guest House — comfortable stays at affordable prices." />
      <PageHero title="Our Rooms & Suites" subtitle="Choose from a range of comfortable, well-appointed rooms." image="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600&q=85" />

      <section className="section-y">
        <div className="container-x">
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                  filter === c ? 'bg-navy text-white' : 'bg-beige text-charcoal hover:bg-beige-2'
                }`}
              >
                {c === 'All' ? t('All Rooms') : t(c + ' Room') !== c + ' Room' ? t(c + ' Room') : c}
              </button>
            ))}
          </div>

          <div className="flex justify-center md:justify-end mb-8 -mt-6">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2.5 rounded-full text-sm font-semibold bg-beige text-charcoal border border-black/5 cursor-pointer"
            >
              <option value="recommended">{t('Recommended')}</option>
              <option value="priceLow">{t('Price: Low to High')}</option>
              <option value="priceHigh">{t('Price: High to Low')}</option>
              <option value="popular">{t('Most Popular')}</option>
            </select>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                {shown.map((r, i) => (
                  <div key={r.id || r._id || i} className={`reveal d${i % 3} h-full`}>
                    <RoomCard room={r} onImageClick={setBox} />
                  </div>
                ))}
              </div>

              {shown.length === 0 && (
                <p className="text-center text-graytxt py-16">No rooms found in this category.</p>
              )}
            </>
          )}
        </div>
      </section>

      <Lightbox item={box} onClose={() => setBox(null)} />
    </>
  )
}

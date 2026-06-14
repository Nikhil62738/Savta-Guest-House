import { useState } from 'react'
import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { GALLERY, GALLERY_CATS, GALLERY_VIDEOS } from '../data/site.js'

export default function Gallery() {
  const { t } = useLang()
  const [filter, setFilter] = useState('All')
  const [tab, setTab] = useState('photos')
  const [box, setBox] = useState(null)
  useReveal(filter + tab)

  const shown = filter === 'All' ? GALLERY : GALLERY.filter((g) => g.cat === filter)

  return (
    <>
      <Seo title="Gallery" description="Photo and video gallery of Sawta Guest House — rooms, reception, exterior, dining and more." />
      <PageHero title="Photo & Video Gallery" subtitle="Take a visual tour of Sawta Guest House." image="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600&q=85" />

      <section className="section-y">
        <div className="container-x">
          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            {[['photos', 'Photos'], ['videos', 'Videos']].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === id ? 'bg-gold text-navy' : 'bg-beige text-charcoal hover:bg-beige-2'}`}>
                {t(label)}
              </button>
            ))}
          </div>

          {tab === 'photos' ? (
            <>
              {/* Category filters */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {GALLERY_CATS.map((c) => (
                  <button key={c} onClick={() => setFilter(c)} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${filter === c ? 'bg-navy text-white' : 'bg-beige text-charcoal hover:bg-beige-2'}`}>
                    {c === 'All' ? t('All Photos') : t(c)}
                  </button>
                ))}
              </div>

              <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
                {shown.map((g, i) => (
                  <button key={g.label + i} onClick={() => setBox({ src: g.src, label: g.label })} className="reveal group relative block w-full overflow-hidden rounded-xl2 break-inside-avoid">
                    <img src={g.src} alt={g.label} loading="lazy" className="w-full transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute inset-0 bg-navy/0 group-hover:bg-navy/45 transition-colors grid place-items-center text-white opacity-0 group-hover:opacity-100 text-sm font-medium">{g.label}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {GALLERY_VIDEOS.map((v, i) => (
                <button key={i} onClick={() => setBox({ src: v.src, label: v.label, type: 'video' })} className="reveal group relative overflow-hidden rounded-xl2 h-72">
                  <img src={v.poster} alt={v.label} loading="lazy" className="w-full h-full transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid place-items-center w-16 h-16 rounded-full bg-white/90 text-navy text-2xl group-hover:bg-gold transition-colors">▶</span>
                  </span>
                  <span className="absolute bottom-4 left-5 text-white font-medium">{v.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Lightbox item={box} onClose={() => setBox(null)} />
    </>
  )
}

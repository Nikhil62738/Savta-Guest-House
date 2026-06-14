import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import { FACILITIES } from '../data/site.js'
import { facilityEmoji } from './Home.jsx'

export default function Facilities() {
  const { t } = useLang()
  useReveal('facilities')

  return (
    <>
      <Seo title="Facilities & Amenities" description="Free WiFi, parking, AC, hot water, CCTV security, room service, 24x7 support and more at Sawta Guest House." />
      <PageHero title="Facilities & Amenities" subtitle="Everything you need for a comfortable, worry-free stay." image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85" />

      <section className="section-y">
        <div className="container-x">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {FACILITIES.map((f, i) => (
              <div key={f.name} className={`reveal d${i % 3} group bg-white rounded-xl2 p-8 shadow-sm2 hover:shadow-card hover:-translate-y-1 transition-all border border-black/5`}>
                <div className="grid place-items-center w-16 h-16 rounded-2xl bg-beige text-3xl group-hover:bg-gold transition-colors">
                  {facilityEmoji(f.icon)}
                </div>
                <h3 className="font-serif text-xl text-navy font-semibold mt-5">{t(f.name)}</h3>
                <p className="text-graytxt mt-2 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

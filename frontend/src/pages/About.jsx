import useReveal from '../hooks/useReveal.js'
import { useLang } from '../context/LanguageContext.jsx'
import Seo from '../components/Seo.jsx'
import PageHero from '../components/PageHero.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { TEAM, STATS, VALUES } from '../data/site.js'

export default function About() {
  const { t } = useLang()
  useReveal('about')

  return (
    <>
      <Seo title="About Us" description="The story, mission and people behind Sawta Guest House in Maharashtra, India." />
      <PageHero title="About Sawta Guest House" subtitle="A family-run guest house built on warmth, comfort and trust." image="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1600&q=85" />

      {/* History */}
      <section className="section-y">
        <div className="container-x grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85" alt="Guest house" loading="lazy" className="rounded-xl2 shadow-card w-full" />
          </div>
          <div className="reveal d1">
            <SectionHeading eyebrow="Our Story" title="A Decade Of <em>Hospitality</em>" />
            <p className="text-graytxt leading-[1.9] mt-5">
              Sawta Guest House began in 2014 with a simple idea — to offer travellers a clean, comfortable and affordable place to stay, backed by genuine, family-style hospitality. What started as a modest lodging has grown into a trusted name welcoming over 500 happy guests every year.
            </p>
            <p className="text-graytxt leading-[1.9] mt-4">
              Today we offer 20+ well-appointed rooms, modern amenities and round-the-clock support — all while keeping the personal warmth that our guests remember most.
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Philosophy */}
      <section className="section-y bg-beige">
        <div className="container-x grid md:grid-cols-3 gap-7">
          {[
            { icon: '🎯', title: 'Our Mission', text: 'To provide comfortable, affordable and memorable stays through attentive service and spotless rooms.' },
            { icon: '🔭', title: 'Our Vision', text: 'To be the most loved and trusted guest house in Maharashtra, known for warmth and value.' },
            { icon: '🤝', title: 'Our Philosophy', text: 'Every guest is family. We treat each stay with the care, respect and hospitality we would want ourselves.' },
          ].map((c, i) => (
            <div key={c.title} className={`reveal d${i} bg-white rounded-xl2 p-8 shadow-sm2`}>
              <div className="text-4xl">{c.icon}</div>
              <h3 className="font-serif text-xl text-navy font-semibold mt-4">{c.title}</h3>
              <p className="text-graytxt mt-3 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values + stats */}
      <section className="section-y">
        <div className="container-x">
          <SectionHeading center eyebrow="What We Value" title="Principles That <em>Guide Us</em>" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {VALUES.map((v, i) => (
              <div key={v.title} className={`reveal d${i % 4} text-center bg-beige rounded-xl2 p-8`}>
                <div className="text-4xl">{v.icon}</div>
                <h3 className="font-serif text-lg text-navy font-semibold mt-4">{v.title}</h3>
                <p className="text-sm text-graytxt mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-14 mt-16">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-gold-dark text-5xl font-bold">{s.value}</div>
                <div className="text-sm tracking-widest uppercase text-graytxt mt-2">{t(s.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner / Team */}
      <section className="section-y bg-navy text-white">
        <div className="container-x">
          <SectionHeading center light eyebrow="Our People" title="Meet The <em>Sawta Family</em>" lede="The dedicated team that makes your stay special." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 mt-14">
            {TEAM.map((m, i) => (
              <div key={m.name} className={`reveal d${i % 4} text-center`}>
                <img src={m.img} alt={m.name} loading="lazy" className="w-28 h-28 rounded-full mx-auto object-cover ring-4 ring-gold/30" />
                <h3 className="font-serif text-lg font-semibold mt-4">{m.name}</h3>
                <p className="text-gold-light text-sm">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

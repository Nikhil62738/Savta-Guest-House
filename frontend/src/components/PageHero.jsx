import { useLang } from '../context/LanguageContext.jsx'

// Inner-page hero banner with a background image and overlay.
export default function PageHero({ title, subtitle, image }) {
  const { t } = useLang()
  const bg = {
    backgroundImage: `linear-gradient(rgba(15,23,42,.72), rgba(15,23,42,.82)), url(${image})`,
  }
  return (
    <section
      className="relative pt-40 pb-24 bg-center bg-cover"
      style={bg}
    >
      <div className="container-x text-center">
        <span className="eyebrow light justify-center">Sawta Guest House</span>
        <h1 className="heading !text-white text-[clamp(2.2rem,5vw,3.6rem)]">{t(title)}</h1>
        {subtitle && <p className="lede !text-white/75 mx-auto mt-4">{t(subtitle)}</p>}
      </div>
    </section>
  )
}

import { useLang } from '../context/LanguageContext.jsx'

// Eyebrow + title + optional lede block, centered or left-aligned.
// `title` may contain <em>...</em> to highlight part of the heading in gold.
export default function SectionHeading({ eyebrow, title, lede, center, light }) {
  const { t } = useLang()
  const titleHtml = { __html: t(title) }
  return (
    <div className={`${center ? 'text-center mx-auto' : ''} max-w-[640px]`}>
      {eyebrow && (
        <span className={`eyebrow ${light ? 'light' : ''} ${center ? 'justify-center' : ''}`}>{t(eyebrow)}</span>
      )}
      <h2 className={`heading ${light ? '!text-white' : ''}`} dangerouslySetInnerHTML={titleHtml} />
      <div className={`gold-line ${center ? 'mx-auto' : ''}`} />
      {lede && <p className={`lede mt-5 ${center ? 'mx-auto' : ''} ${light ? '!text-white/70' : ''}`}>{t(lede)}</p>}
    </div>
  )
}

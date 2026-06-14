import { Helmet } from 'react-helmet-async'

// Reusable SEO component: meta tags, Open Graph + optional JSON-LD structured data.
export default function Seo({ title, description, image, jsonLd }) {
  const fullTitle = title ? `${title} | Sawta Guest House` : 'Sawta Guest House — Comfortable Stay, Affordable Price'
  const desc =
    description ||
    'Sawta Guest House in Maharashtra, India — premium rooms, modern facilities and warm hospitality at an affordable price.'
  const img = image || 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=85'
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}

export const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Sawta Guest House',
  description: 'Premium guest house and lodging in Maharashtra, India.',
  image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=85',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Main Temple Road, City Center',
    addressRegion: 'Maharashtra',
    postalCode: '431001',
    addressCountry: 'IN',
  },
  telephone: '+91-98765-43210',
  priceRange: '₹1,200 - ₹4,500',
  starRating: { '@type': 'Rating', ratingValue: '4.9' },
}

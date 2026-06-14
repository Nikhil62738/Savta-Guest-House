// Static marketing content for the app (offers, facilities, nearby attractions).
// Rooms, gallery and reviews are fetched live from the backend.

export const HERO = {
  title: 'Sawta Guest House',
  subtitle: 'Comfortable Stay, Affordable Price',
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
}

export const ONBOARDING_BENEFITS = [
  { icon: 'bed-outline', title: 'Easy Room Booking', desc: 'Book your perfect room in just a few taps.' },
  { icon: 'pricetags-outline', title: 'Exclusive Mobile Offers', desc: 'Special deals available only in the app.' },
  { icon: 'time-outline', title: 'Booking History', desc: 'Track all your stays in one place.' },
  { icon: 'notifications-outline', title: 'Instant Notifications', desc: 'Stay updated on bookings and offers.' },
  { icon: 'chatbubbles-outline', title: 'Faster Support', desc: 'Reach us instantly via call or WhatsApp.' },
]

export const OFFERS = [
  { id: 'o1', title: 'Early Bird 15% Off', desc: 'Book 7 days ahead and save 15% on any room.', tag: 'Limited' },
  { id: 'o2', title: 'Weekend Family Deal', desc: 'Family rooms at special weekend pricing.', tag: 'Weekends' },
  { id: 'o3', title: 'Extended Stay', desc: 'Stay 3+ nights and get the 4th night free.', tag: 'Popular' },
]

export const FACILITIES = [
  { icon: 'wifi-outline', name: 'Free WiFi' },
  { icon: 'car-outline', name: 'Parking' },
  { icon: 'snow-outline', name: 'Air Conditioning' },
  { icon: 'water-outline', name: 'Hot Water' },
  { icon: 'videocam-outline', name: 'CCTV Security' },
  { icon: 'people-outline', name: 'Family Friendly' },
  { icon: 'headset-outline', name: '24x7 Support' },
  { icon: 'restaurant-outline', name: 'Room Service' },
  { icon: 'tv-outline', name: 'Television' },
  { icon: 'flash-outline', name: 'Power Backup' },
]

export const NEARBY = [
  { name: 'Gajanan Maharaj Temple', distance: '2.5 km', icon: 'business-outline' },
  { name: 'Railway Station', distance: '1.2 km', icon: 'train-outline' },
  { name: 'Bus Stand', distance: '0.8 km', icon: 'bus-outline' },
  { name: 'City Market', distance: '1.0 km', icon: 'storefront-outline' },
  { name: 'Local Hospital', distance: '1.8 km', icon: 'medkit-outline' },
]

export const GALLERY_CATEGORIES = ['All', 'Rooms', 'Reception', 'Exterior', 'Dining']

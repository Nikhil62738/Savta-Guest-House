// Central content/data for the public site (ported "as is" from the original HTML).
// In production these are also served from the backend (rooms, gallery, reviews).

export const CONTACT = {
  phone1: '+91 98765 43210',
  phone2: '+91 94321 00000',
  email1: 'info@sawtaguesthouse.com',
  email2: 'bookings@sawtaguesthouse.com',
  whatsapp: '919876543210',
  address: 'Near Main Temple Road, City Center, Maharashtra 431001',
  checkIn: '12:00 PM',
  checkOut: '11:00 AM',
  reception: 'Open 24/7',
}

export const STATS = [
  { value: '500+', label: 'Happy Guests' },
  { value: '20+', label: 'Comfy Rooms' },
  { value: '10+', label: 'Years Hosting' },
]

// Room categories required by the prompt
export const ROOM_TYPES = ['Standard', 'Deluxe', 'Family', 'AC', 'Non AC']

export const ROOMS = [
  {
    id: 'standard',
    name: 'Standard Room',
    category: 'Standard',
    price: 1200,
    occupancy: '2 Guests',
    totalUnits: 10,
    bookedOnline: 1,
    bookedOffline: 0,
    desc: 'Cozy and clean room with all the essentials for a comfortable, budget-friendly stay.',
    amenities: ['Free WiFi', 'Television', 'Hot Water', '2 Guests'],
    features: ['Comfortable Double Bed', 'Free WiFi', '24\" LED TV', 'Hot & Cold Water', 'Daily Housekeeping', '2 Guests'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=900&q=80',
    ],
  },
  {
    id: 'deluxe',
    name: 'Deluxe Room',
    category: 'Deluxe',
    price: 2000,
    occupancy: '2 Guests',
    totalUnits: 6,
    bookedOnline: 1,
    bookedOffline: 0,
    desc: 'Spacious air-conditioned room with a private balcony and premium comforts.',
    amenities: ['Split AC', 'Smart TV', 'Balcony', '2 Guests'],
    features: ['Split AC', 'WiFi 50 Mbps', '32\" Smart LED TV', 'Private Balcony', 'Mini Refrigerator', '2 Guests'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=80',
    ],
  },
  {
    id: 'family',
    name: 'Family Room',
    category: 'Family',
    price: 3500,
    occupancy: '6 Guests',
    totalUnits: 4,
    bookedOnline: 0,
    bookedOffline: 0,
    desc: 'Two-bedroom suite ideal for families, with ample space and a bathtub.',
    amenities: ['2 Bedrooms', 'AC', 'Bathtub', '6 Guests'],
    features: ['Two Bedrooms', 'Air Conditioning', 'WiFi 50 Mbps', 'Bathtub', 'Seating Area', '6 Guests'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Suite',
    category: 'AC',
    price: 4500,
    occupancy: '2 Guests',
    totalUnits: 5,
    bookedOnline: 0,
    bookedOffline: 0,
    desc: 'Our finest suite with inverter AC, a work desk and elegant interiors.',
    amenities: ['Inverter AC', 'Work Desk', 'Kettle', '2 Guests'],
    features: ['Inverter AC', 'Business WiFi 100 Mbps', '40\" LED Smart TV', 'Work Desk & Chair', 'Electric Kettle', '2 Guests'],
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80',
    ],
  },
]

export const FACILITIES = [
  { icon: 'wifi', name: 'Free WiFi', desc: 'High-speed internet throughout the property.' },
  { icon: 'parking', name: 'Parking', desc: 'Spacious and secure on-site parking.' },
  { icon: 'ac', name: 'Air Conditioning', desc: 'Climate-controlled rooms for every season.' },
  { icon: 'water', name: 'Hot Water', desc: '24-hour hot & cold running water.' },
  { icon: 'cctv', name: 'CCTV Security', desc: 'Round-the-clock surveillance for safety.' },
  { icon: 'family', name: 'Family Friendly', desc: 'A warm, welcoming space for families.' },
  { icon: 'support', name: '24x7 Support', desc: 'Our team is always here to help you.' },
  { icon: 'service', name: 'Room Service', desc: 'In-room dining and prompt assistance.' },
  { icon: 'tv', name: 'Television', desc: 'LED TVs with popular channels in every room.' },
  { icon: 'power', name: 'Power Backup', desc: 'Uninterrupted power with full backup.' },
]

export const VALUES = [
  { icon: '🤝', title: 'Guest-First', desc: 'Every decision starts with your comfort and happiness.' },
  { icon: '✨', title: 'Spotless', desc: 'Immaculate rooms and spaces, cleaned daily.' },
  { icon: '🛡️', title: 'Safe & Secure', desc: 'CCTV, secure access and 24/7 staff presence.' },
  { icon: '🌐', title: 'Modern Amenities', desc: 'Thoughtful, modern facilities in every room.' },
]

export const TEAM = [
  { name: 'Ramesh Sawta', role: 'Founder & Owner', img: 'https://randomuser.me/api/portraits/men/52.jpg' },
  { name: 'Sunita Sawta', role: 'Operations Lead', img: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { name: 'Anil Kumar', role: 'Head Reception', img: 'https://randomuser.me/api/portraits/men/33.jpg' },
  { name: 'Meena Devi', role: 'Housekeeping', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
]

export const REVIEWS = [
  { name: 'Arjun Sharma', city: 'Mumbai', rating: 5, text: 'Wonderful stay! The rooms were spotless and the staff went out of their way to help us. Highly recommended.', img: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { name: 'Priya Nair', city: 'Pune', rating: 5, text: 'Great value for money. Comfortable beds, fast WiFi and a very warm welcome. Will definitely come back.', img: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { name: 'Rahul Verma', city: 'Delhi', rating: 5, text: 'The family room was perfect for us. Clean, spacious and peaceful. The location is very convenient too.', img: 'https://randomuser.me/api/portraits/men/31.jpg' },
  { name: 'Kavya Iyer', city: 'Bangalore', rating: 5, text: 'Felt like a home away from home. Hospitality was top-notch and the food recommendations were excellent.', img: 'https://randomuser.me/api/portraits/women/41.jpg' },
  { name: 'Vikram Singh', city: 'Jaipur', rating: 5, text: 'Excellent service and very affordable. The premium suite is worth every rupee. Loved the experience.', img: 'https://randomuser.me/api/portraits/men/51.jpg' },
  { name: 'Sneha Patel', city: 'Ahmedabad', rating: 5, text: 'Clean, safe and friendly. The 24/7 reception made late check-in stress-free. Highly recommend Sawta.', img: 'https://randomuser.me/api/portraits/women/61.jpg' },
]

export const ATTRACTIONS = [
  { name: 'Local Temple', dist: '0.5 km' },
  { name: 'Market Area', dist: '1.0 km' },
  { name: 'Railway Station', dist: '2.0 km' },
  { name: 'Bus Stand', dist: '1.5 km' },
  { name: 'Tourist Spots', dist: '3.0 km' },
]

export const GALLERY = [
  { cat: 'Exterior', label: 'Exterior View', src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80' },
  { cat: 'Rooms', label: 'Deluxe Room', src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80' },
  { cat: 'Rooms', label: 'Standard Room', src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80' },
  { cat: 'Reception', label: 'Reception', src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80' },
  { cat: 'Rooms', label: 'Family Suite', src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80' },
  { cat: 'Rooms', label: 'Premium Suite', src: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=900&q=80' },
  { cat: 'Dining', label: 'Dining Area', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80' },
  { cat: 'Reception', label: 'Lobby', src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80' },
  { cat: 'Parking', label: 'Parking Area', src: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=900&q=80' },
  { cat: 'Exterior', label: 'Night View', src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80' },
  { cat: 'Rooms', label: 'Bathroom', src: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=900&q=80' },
  { cat: 'Dining', label: 'Restaurant', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80' },
]

export const GALLERY_CATS = ['All', 'Rooms', 'Reception', 'Exterior', 'Dining', 'Parking']

export const GALLERY_VIDEOS = [
  { label: 'Property Tour', poster: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80', src: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { label: 'Room Walkthrough', poster: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80', src: 'https://www.w3schools.com/html/movie.mp4' },
]

// Mobile app (Android APK) download — used by the website download popup.
export const APP = {
  name: 'Savta Guest House App',
  version: '1.0.0',
  // Put the built APK at frontend/public/downloads/sawta-guest-house.apk,
  // or set this to an external link (Expo / Google Drive / etc.).
  downloadUrl: '/downloads/sawta-guest-house.apk',
}

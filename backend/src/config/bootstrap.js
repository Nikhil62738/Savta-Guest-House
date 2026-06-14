import User from '../models/User.js'
import Room from '../models/Room.js'
import Review from '../models/Review.js'

// Runs once on every server start. It is fully idempotent: it never deletes or
// duplicates data. This lets the app work on hosting plans that do not allow a
// Shell / one-off command to run "npm run seed".

const SAMPLE_ROOMS = [
  { name: 'Standard Room', totalUnits: 10, bookedOnline: 5, bookedOffline: 2, category: 'Standard', type: 'Non AC', price: 1200, occupancy: 2, status: 'Active', description: 'Cozy and clean room with all the essentials for a comfortable stay.', amenities: ['Free WiFi', 'TV', 'Hot Water'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80'] },
  { name: 'Deluxe Room', totalUnits: 6, bookedOnline: 3, bookedOffline: 1, category: 'Deluxe', type: 'AC', price: 2000, occupancy: 2, status: 'Active', description: 'Spacious air-conditioned room with a private balcony.', amenities: ['AC', 'Free WiFi', 'TV', 'Balcony', 'Mini Fridge'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80'] },
  { name: 'Family Room', totalUnits: 4, bookedOnline: 1, bookedOffline: 1, category: 'Family', type: 'AC', price: 3000, occupancy: 4, status: 'Active', description: 'Two-bedroom suite ideal for families.', amenities: ['AC', 'Free WiFi', 'TV', 'Hot Water'], images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80'] },
  { name: 'AC Room', totalUnits: 5, bookedOnline: 2, bookedOffline: 0, category: 'AC', type: 'AC', price: 2500, occupancy: 2, status: 'Active', description: 'Comfortable air-conditioned room with modern amenities.', amenities: ['AC', 'Free WiFi', 'TV', 'Work Desk'], images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80'] },
  { name: 'Non AC Room', totalUnits: 8, bookedOnline: 0, bookedOffline: 0, category: 'Non AC', type: 'Non AC', price: 1000, occupancy: 2, status: 'Inactive', description: 'Budget-friendly room with all the basics.', amenities: ['Free WiFi', 'TV', 'Hot Water'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80'] },
]

const SAMPLE_REVIEWS = [
  { name: 'Arjun Sharma', city: 'Mumbai', rating: 5, comment: 'Wonderful stay! Spotless rooms and great staff.', status: 'Approved' },
  { name: 'Priya Nair', city: 'Pune', rating: 5, comment: 'Great value for money. Will definitely come back.', status: 'Approved' },
  { name: 'Megha Kulkarni', city: 'Nashik', rating: 4, comment: 'Good value, comfortable beds.', status: 'Pending' },
]

export default async function bootstrap() {
  // 1) Make sure an admin login exists (fixes the 401 on a fresh hosted DB).
  const email = (process.env.ADMIN_EMAIL || 'admin@sawtaguesthouse.com').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'
  const name = process.env.ADMIN_NAME || 'Sawta Admin'

  const existingAdmin = await User.findOne({ role: 'admin' })
  if (!existingAdmin) {
    await User.create({ name, email, password, role: 'admin' })
    console.log('\uD83D\uDC64 Admin account created on startup: ' + email)
  } else {
    console.log('\uD83D\uDC64 Admin account already exists: ' + existingAdmin.email)
  }

  // 2) On a brand-new (empty) database only, add sample rooms + reviews so the
  //    live site is not blank. Skips entirely once any room exists, or when
  //    SEED_SAMPLE_DATA is set to 'false'.
  if (process.env.SEED_SAMPLE_DATA !== 'false') {
    const roomCount = await Room.countDocuments()
    if (roomCount === 0) {
      await Room.insertMany(SAMPLE_ROOMS)
      console.log('\uD83C\uDFE8 Seeded ' + SAMPLE_ROOMS.length + ' sample rooms')
    }
    const reviewCount = await Review.countDocuments()
    if (reviewCount === 0) {
      await Review.insertMany(SAMPLE_REVIEWS)
      console.log('\u2B50 Seeded ' + SAMPLE_REVIEWS.length + ' sample reviews')
    }
  }
}

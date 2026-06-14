import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import User from './models/User.js'
import Room from './models/Room.js'
import Booking from './models/Booking.js'
import Gallery from './models/Gallery.js'
import Review from './models/Review.js'
import ContactMessage from './models/ContactMessage.js'

const rooms = [
  { name: 'Standard Room', totalUnits: 10, bookedOnline: 5, bookedOffline: 2, category: 'Standard', type: 'Non AC', price: 1200, occupancy: 2, status: 'Active', description: 'Cozy and clean room with all the essentials for a comfortable stay.', amenities: ['Free WiFi', 'TV', 'Hot Water'], images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80'] },
  { name: 'Deluxe Room', totalUnits: 6, bookedOnline: 3, bookedOffline: 1, category: 'Deluxe', type: 'AC', price: 2000, occupancy: 2, status: 'Active', description: 'Spacious air-conditioned room with a private balcony.', amenities: ['AC', 'Free WiFi', 'TV', 'Balcony', 'Mini Fridge'], images: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80'] },
  { name: 'Family Room', totalUnits: 4, bookedOnline: 1, bookedOffline: 1, category: 'Family', type: 'AC', price: 3000, occupancy: 4, status: 'Active', description: 'Two-bedroom suite ideal for families.', amenities: ['AC', 'Free WiFi', 'TV', 'Hot Water'], images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=900&q=80'] },
  { name: 'AC Room', totalUnits: 5, bookedOnline: 2, bookedOffline: 0, category: 'AC', type: 'AC', price: 2500, occupancy: 2, status: 'Active', description: 'Comfortable air-conditioned room with modern amenities.', amenities: ['AC', 'Free WiFi', 'TV', 'Work Desk'], images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80'] },
  { name: 'Non AC Room', totalUnits: 8, bookedOnline: 0, bookedOffline: 0, category: 'Non AC', type: 'Non AC', price: 1000, occupancy: 2, status: 'Inactive', description: 'Budget-friendly room with all the basics.', amenities: ['Free WiFi', 'TV', 'Hot Water'], images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=80'] },
]

const bookings = [
  { name: 'Rahul Sharma', mobile: '+91 98765 43201', email: 'rahul.sharma@gmail.com', roomType: 'Deluxe', checkIn: '2025-06-12', checkOut: '2025-06-14', guests: 2, source: 'Online', status: 'Confirmed' },
  { name: 'Priya Patel', mobile: '+91 98765 43202', email: 'priya.patel@gmail.com', roomType: 'Family', checkIn: '2025-06-15', checkOut: '2025-06-18', guests: 4, source: 'Online', status: 'Pending' },
  { name: 'Amit Verma', mobile: '+91 98765 43203', email: 'amit.verma@gmail.com', roomType: 'Standard', checkIn: '2025-06-10', checkOut: '2025-06-11', guests: 1, source: 'Online', status: 'Cancelled' },
  { name: 'Neha Singh', mobile: '+91 98765 43204', email: 'neha.singh@gmail.com', roomType: 'AC', checkIn: '2025-06-05', checkOut: '2025-06-07', guests: 2, source: 'Offline', status: 'Completed' },
  { name: 'Vikram Joshi', mobile: '+91 98765 43205', email: 'vikram.joshi@gmail.com', roomType: 'Deluxe', checkIn: '2025-06-20', checkOut: '2025-06-22', guests: 2, source: 'Online', status: 'Pending' },
]

const gallery = [
  { label: 'Exterior View', cat: 'Exterior', type: 'image', src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80' },
  { label: 'Deluxe Room', cat: 'Rooms', type: 'image', src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=80' },
  { label: 'Reception', cat: 'Reception', type: 'image', src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80' },
  { label: 'Dining Area', cat: 'Dining', type: 'image', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80' },
]

const reviews = [
  { name: 'Arjun Sharma', city: 'Mumbai', rating: 5, comment: 'Wonderful stay! Spotless rooms and great staff.', status: 'Approved' },
  { name: 'Priya Nair', city: 'Pune', rating: 5, comment: 'Great value for money. Will definitely come back.', status: 'Approved' },
  { name: 'Megha Kulkarni', city: 'Nashik', rating: 4, comment: 'Good value, comfortable beds.', status: 'Pending' },
]

const messages = [
  { name: 'Sanjay Mehta', email: 'sanjay.mehta@gmail.com', phone: '+91 99887 76651', subject: 'Room Booking', message: 'Do you have a family room available next weekend?' },
  { name: 'Anita Rao', email: 'anita.rao@gmail.com', phone: '+91 99887 76652', subject: 'General Inquiry', message: 'Is parking available for larger vehicles?' },
]

async function run() {
  await connectDB()
  console.log('🌱 Seeding database…')

  await Promise.all([
    User.deleteMany({}),
    Room.deleteMany({}),
    Booking.deleteMany({}),
    Gallery.deleteMany({}),
    Review.deleteMany({}),
    ContactMessage.deleteMany({}),
  ])

  await User.create({
    name: process.env.ADMIN_NAME || 'Sawta Admin',
    email: process.env.ADMIN_EMAIL || 'admin@sawtaguesthouse.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
  })

  await Room.insertMany(rooms)
  await Booking.insertMany(bookings)
  await Gallery.insertMany(gallery)
  await Review.insertMany(reviews)
  await ContactMessage.insertMany(messages)

  console.log('✅ Seed complete.')
  console.log(`   Admin login: ${process.env.ADMIN_EMAIL || 'admin@sawtaguesthouse.com'} / ${process.env.ADMIN_PASSWORD || 'Admin@123'}`)
  await mongoose.connection.close()
  process.exit(0)
}

run().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

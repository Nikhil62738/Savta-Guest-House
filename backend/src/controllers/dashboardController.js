import Room from '../models/Room.js'
import Booking from '../models/Booking.js'
import Gallery from '../models/Gallery.js'
import ContactMessage from '../models/ContactMessage.js'
import Review from '../models/Review.js'

// GET /api/dashboard/stats (admin)
export async function getStats(req, res) {
  const [totalBookings, totalRooms, totalGallery, totalContacts, pendingReviews, roomTypes] =
    await Promise.all([
      Booking.countDocuments(),
      Room.countDocuments(),
      Gallery.countDocuments(),
      ContactMessage.countDocuments(),
      Review.countDocuments({ status: 'Pending' }),
      Room.distinct('category'),
    ])

  res.json({
    totalBookings,
    totalRooms,
    totalGallery,
    totalContacts,
    pendingReviews,
    roomTypes: roomTypes.length,
  })
}

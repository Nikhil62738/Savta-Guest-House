import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    // Specific room/category this booking is for (preferred). roomType kept for display + legacy bookings.
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    roomType: { type: String, required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, default: 1, min: 1 },
    specialRequest: { type: String, default: '' },
    // 'Online' = guest inquiry from website, 'Offline' = walk-in/phone added by admin
    source: { type: String, enum: ['Online', 'Offline'], default: 'Online' },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
)

export default mongoose.model('Booking', bookingSchema)

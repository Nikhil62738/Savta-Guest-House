import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ['Standard', 'Deluxe', 'Family', 'AC', 'Non AC'], default: 'Standard' },
    type: { type: String, enum: ['AC', 'Non AC'], default: 'Non AC' },
    price: { type: Number, required: true, min: 0 },
    occupancy: { type: Number, default: 2, min: 1 },
    description: { type: String, default: '' },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    // Inventory per category/type
    totalUnits: { type: Number, default: 1, min: 0 },
    bookedOnline: { type: Number, default: 0, min: 0 },
    bookedOffline: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

// Available units = total - (online + offline), never below 0
roomSchema.virtual('available').get(function () {
  const booked = (this.bookedOnline || 0) + (this.bookedOffline || 0)
  return Math.max(0, (this.totalUnits || 0) - booked)
})

export default mongoose.model('Room', roomSchema)

import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema(
  {
    label: { type: String, default: '' },
    cat: { type: String, default: 'Rooms' },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    src: { type: String, required: true },
    publicId: { type: String }, // Cloudinary public_id for deletion
  },
  { timestamps: true }
)

export default mongoose.model('Gallery', gallerySchema)

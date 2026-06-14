import Gallery from '../models/Gallery.js'
import { cloudinary, uploadBuffers } from '../config/cloudinary.js'

// GET /api/gallery
export async function listGallery(req, res) {
  const filter = {}
  if (req.query.cat && req.query.cat !== 'All') filter.cat = req.query.cat
  const gallery = await Gallery.find(filter).sort('-createdAt')
  res.json({ gallery })
}

// POST /api/gallery (admin) — one or more images/videos via Cloudinary
export async function uploadGallery(req, res) {
  const files = req.files || []
  if (!files.length) return res.status(400).json({ message: 'No files uploaded' })
  const uploaded = await uploadBuffers(files)
  const docs = await Gallery.insertMany(
    uploaded.map((u, i) => ({
      label: req.body.label || files[i].originalname,
      cat: req.body.cat || 'Rooms',
      type: u.type,
      src: u.url,
      publicId: u.publicId,
    }))
  )
  res.status(201).json({ gallery: docs })
}

// DELETE /api/gallery/:id (admin)
export async function deleteGallery(req, res) {
  const item = await Gallery.findById(req.params.id)
  if (!item) return res.status(404).json({ message: 'Media not found' })
  if (item.publicId) {
    try {
      await cloudinary.uploader.destroy(item.publicId, {
        resource_type: item.type === 'video' ? 'video' : 'image',
      })
    } catch (_) {}
  }
  await item.deleteOne()
  res.json({ message: 'Media deleted' })
}

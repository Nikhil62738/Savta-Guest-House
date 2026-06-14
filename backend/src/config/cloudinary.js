import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Keep files in memory so we can stream them straight to Cloudinary.
// (No multer-storage-cloudinary — it only supports the deprecated Cloudinary v1 SDK.)
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
})

// Uploads a single in-memory file buffer to Cloudinary.
// Returns { url, publicId, type } for storing in MongoDB.
export function uploadBuffer(file, folder = 'sawta-guest-house') {
  const isVideo = file.mimetype.startsWith('video')
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isVideo ? 'video' : 'image',
        transformation: isVideo ? undefined : [{ width: 1600, crop: 'limit', quality: 'auto' }],
      },
      (err, result) => {
        if (err) return reject(err)
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          type: isVideo ? 'video' : 'image',
        })
      }
    )
    stream.end(file.buffer)
  })
}

// Uploads many files in parallel.
export function uploadBuffers(files = [], folder = 'sawta-guest-house') {
  return Promise.all(files.map((f) => uploadBuffer(f, folder)))
}

export { cloudinary }

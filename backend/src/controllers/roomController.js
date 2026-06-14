import Room from '../models/Room.js'
import Booking from '../models/Booking.js'
import { uploadBuffers } from '../config/cloudinary.js'

function parseBody(body) {
  const data = { ...body }
  // amenities/images may arrive as JSON strings from multipart forms
  ;['amenities', 'images'].forEach((k) => {
    if (typeof data[k] === 'string') {
      try { data[k] = JSON.parse(data[k]) } catch { data[k] = data[k] ? [data[k]] : [] }
    }
  })
  // numeric fields may arrive as strings from multipart forms
  ;['price', 'occupancy', 'totalUnits'].forEach((k) => {
    if (data[k] !== undefined && data[k] !== '') data[k] = Number(data[k])
  })
  // bookedOnline/bookedOffline are auto-counted from confirmed bookings — never set manually
  delete data.bookedOnline
  delete data.bookedOffline
  return data
}

// Count CONFIRMED bookings, split by source.
// Returns { byId: { '<roomId>': { online, offline } }, byType: { '<roomType>': { online, offline } } }.
// Bookings linked to a specific room are counted under byId; legacy bookings (no room ref)
// are counted under byType and matched later by category or name.
async function bookedCounts() {
  const rows = await Booking.aggregate([
    { $match: { status: 'Confirmed' } },
    { $group: { _id: { room: '$room', roomType: '$roomType', source: '$source' }, count: { $sum: 1 } } },
  ])
  const byId = {}
  const byType = {}
  rows.forEach((row) => {
    const isOffline = row._id.source === 'Offline'
    if (row._id.room) {
      const key = String(row._id.room)
      const entry = byId[key] || { online: 0, offline: 0 }
      if (isOffline) entry.offline += row.count
      else entry.online += row.count
      byId[key] = entry
    } else {
      const key = String(row._id.roomType || '').trim().toLowerCase()
      if (!key) return
      const entry = byType[key] || { online: 0, offline: 0 }
      if (isOffline) entry.offline += row.count
      else entry.online += row.count
      byType[key] = entry
    }
  })
  return { byId, byType }
}

// Attach auto-counted bookedOnline/bookedOffline/available to each room.
function withInventory(roomDocs, counts) {
  const byId = counts.byId || {}
  const byType = counts.byType || {}
  return roomDocs.map((doc) => {
    const room = doc.toObject ? doc.toObject() : doc
    const idCounts = byId[String(room._id)] || { online: 0, offline: 0 }
    const typeCounts =
      byType[String(room.category || '').trim().toLowerCase()] ||
      byType[String(room.name || '').trim().toLowerCase()] ||
      { online: 0, offline: 0 }
    const online = idCounts.online + typeCounts.online
    const offline = idCounts.offline + typeCounts.offline
    room.bookedOnline = online
    room.bookedOffline = offline
    const total = Number(room.totalUnits || 0)
    room.available = Math.max(0, total - online - offline)
    return room
  })
}

// GET /api/rooms  (public sees only Active; admin can pass ?all=1)
export async function listRooms(req, res) {
  const filter = req.query.all ? {} : { status: 'Active' }
  const rooms = await Room.find(filter).sort('-createdAt')
  const counts = await bookedCounts()
  res.json({ rooms: withInventory(rooms, counts) })
}

// GET /api/rooms/:id
export async function getRoom(req, res) {
  const room = await Room.findById(req.params.id)
  if (!room) return res.status(404).json({ message: 'Room not found' })
  const counts = await bookedCounts()
  res.json(withInventory([room], counts)[0])
}

// POST /api/rooms (admin)
export async function createRoom(req, res) {
  const data = parseBody(req.body)
  const uploaded = await uploadBuffers(req.files || [])
  if (uploaded.length) data.images = [...(data.images || []), ...uploaded.map((u) => u.url)]
  const room = await Room.create(data)
  res.status(201).json(room)
}

// PUT /api/rooms/:id (admin)
export async function updateRoom(req, res) {
  const data = parseBody(req.body)
  const uploaded = await uploadBuffers(req.files || [])
  if (uploaded.length) data.images = [...(data.images || []), ...uploaded.map((u) => u.url)]
  const room = await Room.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
  if (!room) return res.status(404).json({ message: 'Room not found' })
  res.json(room)
}

// DELETE /api/rooms/:id (admin)
export async function deleteRoom(req, res) {
  const room = await Room.findByIdAndDelete(req.params.id)
  if (!room) return res.status(404).json({ message: 'Room not found' })
  res.json({ message: 'Room deleted' })
}

// PATCH /api/rooms/:id/units (admin) — add or remove total units in a category
export async function adjustUnits(req, res) {
  const delta = Number(req.body.delta || 0)
  const room = await Room.findById(req.params.id)
  if (!room) return res.status(404).json({ message: 'Room not found' })
  room.totalUnits = Math.max(0, (room.totalUnits || 0) + delta)
  await room.save()
  const counts = await bookedCounts()
  res.json(withInventory([room], counts)[0])
}

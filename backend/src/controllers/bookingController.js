import Booking from '../models/Booking.js'
import Room from '../models/Room.js'
import { notifyNewBooking, notifyBookingConfirmed, notifyBookingCancelled, notifyBookingCompleted } from '../utils/notify.js'

// How many CONFIRMED bookings currently hold a given room (the source of truth for inventory).
async function confirmedCount(roomId) {
  return Booking.countDocuments({ room: roomId, status: 'Confirmed' })
}

function availableUnits(room, confirmed) {
  return Math.max(0, Number(room.totalUnits || 0) - confirmed)
}

// Resolve which physical room a request is for and check availability.
// Returns { room } on success, or { error: { code, message } } when not bookable.
// `room` may be null only for legacy type-based requests with no matching room docs.
async function resolveRoom(body, mustBeAvailable) {
  // 1) Explicit room id (preferred path from the room selector).
  if (body.room) {
    const room = await Room.findById(body.room)
    if (!room) return { error: { code: 404, message: 'The selected room could not be found. Please pick another room.' } }
    if (mustBeAvailable) {
      const taken = await confirmedCount(room._id)
      if (availableUnits(room, taken) <= 0) {
        return { error: { code: 409, message: `Sorry, ${room.name} is fully booked for the selected dates. Please choose another room or adjust your dates.` } }
      }
    }
    return { room }
  }

  // 2) Type/name based (fallback). Find an active matching room with availability.
  const type = String(body.roomType || '').trim()
  if (type) {
    const candidates = await Room.find({ status: 'Active', $or: [{ name: type }, { category: type }] })
    if (candidates.length) {
      if (!mustBeAvailable) return { room: candidates[0] }
      for (const c of candidates) {
        const taken = await confirmedCount(c._id)
        if (availableUnits(c, taken) > 0) return { room: c }
      }
      return { error: { code: 409, message: `Sorry, no ${type} rooms are available right now. Please choose another room or adjust your dates.` } }
    }
  }

  // 3) No matching room docs to validate against (legacy) — allow as best effort.
  return { room: null }
}

// POST /api/bookings
// Public guests: booking is auto-confirmed instantly (no admin approval) when a room is available.
// Admin offline (walk-in) bookings: honor the status the admin chose (defaults to Confirmed).
export async function createBooking(req, res) {
  const body = { ...req.body }
  const isOffline = body.source === 'Offline'

  // Online (guest) requests are always confirmed immediately; offline keeps the admin's status.
  const status = isOffline ? body.status || 'Confirmed' : 'Confirmed'

  // Availability only needs to hold a unit when the booking will actually be Confirmed.
  const { room, error } = await resolveRoom(body, status === 'Confirmed')
  if (error) return res.status(error.code).json({ message: error.message })

  const booking = await Booking.create({
    name: body.name,
    mobile: body.mobile,
    email: body.email,
    room: room ? room._id : undefined,
    roomType: body.roomType || (room ? room.name : undefined),
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: body.guests || 1,
    specialRequest: body.specialRequest || '',
    source: isOffline ? 'Offline' : 'Online',
    status,
  })

  // Alert the admin (bell + console). Never blocks the response.
  notifyNewBooking(booking)

  // Auto-send the guest confirmation (email + WhatsApp) the moment it's confirmed.
  if (status === 'Confirmed') {
    notifyBookingConfirmed(booking).catch((err) => console.error('Confirmation notify failed:', err.message))
  }

  res.status(201).json(booking)
}

// GET /api/bookings (admin) — full history for management. Optional ?status= & ?limit=
export async function listBookings(req, res) {
  // Keep statuses fresh: finish any stays whose check-out date has already passed.
  await autoCompletePastBookings().catch((err) => console.error('Auto-complete failed:', err.message))
  const filter = {}
  if (req.query.status) filter.status = req.query.status
  let q = Booking.find(filter).sort('-createdAt')
  if (req.query.limit) q = q.limit(Number(req.query.limit))
  const bookings = await q
  res.json({ bookings })
}

// PATCH /api/bookings/:id/status (admin) — manage an existing booking (cancel, complete, re-confirm).
export async function updateBookingStatus(req, res) {
  const { status } = req.body
  const allowed = ['Pending', 'Confirmed', 'Cancelled', 'Completed']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })
  const prev = await Booking.findById(req.params.id)
  if (!prev) return res.status(404).json({ message: 'Booking not found' })

  // Guard against double-booking when an admin re-confirms a previously cancelled/pending booking.
  if (status === 'Confirmed' && prev.status !== 'Confirmed' && prev.room) {
    const room = await Room.findById(prev.room)
    if (room) {
      const taken = await confirmedCount(room._id)
      if (availableUnits(room, taken) <= 0) {
        return res.status(409).json({ message: `Cannot confirm — ${room.name} is fully booked.` })
      }
    }
  }

  const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
  if (status === 'Confirmed' && prev.status !== 'Confirmed') {
    notifyBookingConfirmed(booking).catch((err) => console.error('Confirmation notify failed:', err.message))
  }
  // Notify the guest when an admin cancels or completes the booking (online + offline).
  if (status === 'Cancelled' && prev.status !== 'Cancelled') {
    notifyBookingCancelled(booking).catch((err) => console.error('Cancellation notify failed:', err.message))
  }
  if (status === 'Completed' && prev.status !== 'Completed') {
    notifyBookingCompleted(booking).catch((err) => console.error('Completion notify failed:', err.message))
  }
  res.json(booking)
}

// DELETE /api/bookings/:id (admin)
export async function deleteBooking(req, res) {
  const booking = await Booking.findByIdAndDelete(req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found' })
  res.json({ message: 'Booking deleted' })
}

// Compare two mobile numbers by their last 10 digits.
function sameMobile(a, b) {
  const da = String(a || '').replace(/\D/g, '').slice(-10)
  const db = String(b || '').replace(/\D/g, '').slice(-10)
  return da.length === 10 && da === db
}

// GET /api/bookings/lookup?mobile= (public) — let a guest find their own bookings by mobile number.
export async function lookupBookings(req, res) {
  const mobile = String(req.query.mobile || '').trim()
  const last10 = mobile.replace(/\D/g, '').slice(-10)
  if (last10.length < 10) return res.status(400).json({ message: 'Please enter the 10-digit mobile number used for booking.' })
  const bookings = await Booking.find({ mobile: { $regex: last10 } })
    .sort('-createdAt')
    .select('name mobile roomType checkIn checkOut guests status source createdAt')
    .limit(50)
  res.json({ bookings })
}

// PATCH /api/bookings/:id/cancel (public) — a guest cancels their own booking after verifying their mobile.
export async function cancelBookingByGuest(req, res) {
  const mobile = String((req.body && req.body.mobile) || '').trim()
  const booking = await Booking.findById(req.params.id)
  if (!booking) return res.status(404).json({ message: 'Booking not found.' })
  if (!sameMobile(booking.mobile, mobile)) {
    return res.status(403).json({ message: 'This mobile number does not match the booking.' })
  }
  if (booking.status === 'Completed') {
    return res.status(400).json({ message: 'Completed stays cannot be cancelled.' })
  }
  if (booking.status !== 'Cancelled') {
    booking.status = 'Cancelled'
    await booking.save()
    notifyBookingCancelled(booking).catch((err) => console.error('Cancellation notify failed:', err.message))
  }
  res.json({ booking })
}

// Auto-finish stays whose check-out date has passed: mark them Completed and send
// the thank-you email once. Safe to run repeatedly (only touches Confirmed rows).
export async function autoCompletePastBookings() {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const due = await Booking.find({ status: 'Confirmed', checkOut: { $lt: startOfToday } })
  for (const b of due) {
    b.status = 'Completed'
    await b.save()
    notifyBookingCompleted(b).catch((err) => console.error('Completion notify failed:', err.message))
  }
  return due.length
}

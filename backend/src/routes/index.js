import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { protect, adminOnly } from '../middleware/auth.js'
import { authLimiter, formLimiter } from '../middleware/rateLimit.js'
import { upload } from '../config/cloudinary.js'

import * as auth from '../controllers/authController.js'
import * as rooms from '../controllers/roomController.js'
import * as bookings from '../controllers/bookingController.js'
import * as gallery from '../controllers/galleryController.js'
import * as reviews from '../controllers/reviewController.js'
import * as contact from '../controllers/contactController.js'
import * as dashboard from '../controllers/dashboardController.js'

const router = Router()
const admin = [protect, adminOnly]

// wrap async handlers so errors reach the error middleware
const h = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ---------------- Auth ---------------- */
router.post(
  '/auth/login',
  authLimiter,
  [body('email').isEmail(), body('password').notEmpty()],
  validate,
  h(auth.login)
)
router.get('/auth/me', protect, h(auth.me))

/* ---------------- Rooms ---------------- */
router.get('/rooms', h(rooms.listRooms))
router.get('/rooms/:id', h(rooms.getRoom))
router.post('/rooms', admin, upload.array('images', 10), h(rooms.createRoom))
router.put('/rooms/:id', admin, upload.array('images', 10), h(rooms.updateRoom))
router.delete('/rooms/:id', admin, h(rooms.deleteRoom))
router.patch('/rooms/:id/units', admin, h(rooms.adjustUnits))

/* ---------------- Bookings ---------------- */
router.post(
  '/bookings',
  formLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
    body('roomType').notEmpty().withMessage('Please select a room'),
    body('checkIn').notEmpty().isISO8601().withMessage('A valid check-in date is required'),
    body('checkOut')
      .notEmpty().isISO8601().withMessage('A valid check-out date is required')
      .custom((value, { req }) => {
        if (new Date(value) <= new Date(req.body.checkIn)) {
          throw new Error('Check-out must be after check-in')
        }
        return true
      }),
    // Guests must give a reachable email so the confirmation can be delivered automatically.
    body('email')
      .if((value, { req }) => req.body.source !== 'Offline')
      .isEmail().withMessage('A valid email address is required to receive your booking confirmation'),
  ],
  validate,
  h(bookings.createBooking)
)
// Public self-service: guests look up and cancel their own bookings by mobile number.
router.get('/bookings/lookup', formLimiter, h(bookings.lookupBookings))
router.patch('/bookings/:id/cancel', formLimiter, h(bookings.cancelBookingByGuest))
router.get('/bookings', admin, h(bookings.listBookings))
router.patch('/bookings/:id/status', admin, h(bookings.updateBookingStatus))
router.delete('/bookings/:id', admin, h(bookings.deleteBooking))

/* ---------------- Gallery ---------------- */
router.get('/gallery', h(gallery.listGallery))
router.post('/gallery', admin, upload.array('media', 10), h(gallery.uploadGallery))
router.delete('/gallery/:id', admin, h(gallery.deleteGallery))

/* ---------------- Reviews ---------------- */
router.get('/reviews', h(reviews.listApproved))
router.get('/reviews/all', admin, h(reviews.listAll))
router.post(
  '/reviews',
  formLimiter,
  [body('name').trim().notEmpty(), body('rating').isInt({ min: 1, max: 5 }), body('comment').trim().notEmpty()],
  validate,
  h(reviews.createReview)
)
router.patch('/reviews/:id/approve', admin, h(reviews.approveReview))
router.delete('/reviews/:id', admin, h(reviews.deleteReview))

/* ---------------- Contact ---------------- */
router.post(
  '/contact',
  formLimiter,
  [body('name').trim().notEmpty(), body('email').isEmail(), body('message').trim().notEmpty()],
  validate,
  h(contact.createMessage)
)
router.get('/contact', admin, h(contact.listMessages))
router.delete('/contact/:id', admin, h(contact.deleteMessage))

/* ---------------- Dashboard ---------------- */
router.get('/dashboard/stats', admin, h(dashboard.getStats))

export default router

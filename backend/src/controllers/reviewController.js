import Review from '../models/Review.js'

// GET /api/reviews  (public — only approved)
export async function listApproved(req, res) {
  const reviews = await Review.find({ status: 'Approved' }).sort('-createdAt')
  res.json({ reviews })
}

// GET /api/reviews/all (admin)
export async function listAll(req, res) {
  const reviews = await Review.find().sort('-createdAt')
  res.json({ reviews })
}

// POST /api/reviews (public) — created as Pending
export async function createReview(req, res) {
  const { name, rating, comment, city } = req.body
  const review = await Review.create({ name, rating, comment, city, status: 'Pending' })
  res.status(201).json(review)
}

// PATCH /api/reviews/:id/approve (admin)
export async function approveReview(req, res) {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true })
  if (!review) return res.status(404).json({ message: 'Review not found' })
  res.json(review)
}

// DELETE /api/reviews/:id (admin)
export async function deleteReview(req, res) {
  const review = await Review.findByIdAndDelete(req.params.id)
  if (!review) return res.status(404).json({ message: 'Review not found' })
  res.json({ message: 'Review deleted' })
}

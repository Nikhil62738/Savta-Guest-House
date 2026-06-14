import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// POST /api/auth/login
export async function login(req, res) {
  const { email, password } = req.body
  const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password')
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }
  const token = signToken(user)
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
}

// GET /api/auth/me
export async function me(req, res) {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } })
}

import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifies the JWT and attaches the user to req.user
export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null
    if (!token) return res.status(401).json({ message: 'Not authorized, no token' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'User no longer exists' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token failed' })
  }
}

// Restricts a route to admins only
export function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'admin') return next()
  return res.status(403).json({ message: 'Admin access required' })
}

import ContactMessage from '../models/ContactMessage.js'
import { notifyNewContact } from '../utils/notify.js'

// POST /api/contact (public)
export async function createMessage(req, res) {
  const msg = await ContactMessage.create(req.body)
  notifyNewContact(msg)
  res.status(201).json(msg)
}

// GET /api/contact (admin)
export async function listMessages(req, res) {
  const messages = await ContactMessage.find().sort('-createdAt')
  res.json({ messages })
}

// DELETE /api/contact/:id (admin)
export async function deleteMessage(req, res) {
  const msg = await ContactMessage.findByIdAndDelete(req.params.id)
  if (!msg) return res.status(404).json({ message: 'Message not found' })
  res.json({ message: 'Message deleted' })
}

import mongoose from 'mongoose'

export default async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sawta_guest_house'
  mongoose.set('strictQuery', true)
  const conn = await mongoose.connect(uri)
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  return conn
}

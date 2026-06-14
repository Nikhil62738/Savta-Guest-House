// Fallback sample data used when the backend API is not reachable, so the
// admin panel is fully demonstrable out of the box.

export const SAMPLE_STATS = {
  totalBookings: 48,
  totalRooms: 25,
  totalGallery: 36,
  totalContacts: 12,
  roomTypes: 5,
  pendingReviews: 3,
}

export const SAMPLE_ROOMS = [
  { _id: 'r1', totalUnits: 10, bookedOnline: 5, bookedOffline: 2, name: 'Standard Room', category: 'Standard', price: 1200, type: 'Non AC', occupancy: 2, status: 'Active', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80' },
  { _id: 'r2', totalUnits: 6, bookedOnline: 3, bookedOffline: 1, name: 'Deluxe Room', category: 'Deluxe', price: 2000, type: 'AC', occupancy: 2, status: 'Active', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80' },
  { _id: 'r3', totalUnits: 4, bookedOnline: 1, bookedOffline: 1, name: 'Family Room', category: 'Family', price: 3000, type: 'AC', occupancy: 4, status: 'Active', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&q=80' },
  { _id: 'r4', totalUnits: 5, bookedOnline: 2, bookedOffline: 0, name: 'AC Room', category: 'AC', price: 2500, type: 'AC', occupancy: 2, status: 'Active', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80' },
  { _id: 'r5', totalUnits: 8, bookedOnline: 0, bookedOffline: 0, name: 'Non AC Room', category: 'Non AC', price: 1000, type: 'Non AC', occupancy: 2, status: 'Inactive', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&q=80' },
]

export const SAMPLE_BOOKINGS = [
  { _id: 'b1', name: 'Rahul Sharma', email: 'rahul.sharma@gmail.com', mobile: '+91 98765 43201', roomType: 'Deluxe', checkIn: '2025-06-12', checkOut: '2025-06-14', guests: 2, status: 'Confirmed', source: 'Online' },
  { _id: 'b2', name: 'Priya Patel', email: 'priya.patel@gmail.com', mobile: '+91 98765 43202', roomType: 'Family', checkIn: '2025-06-15', checkOut: '2025-06-18', guests: 4, status: 'Pending', source: 'Online' },
  { _id: 'b3', name: 'Amit Verma', email: 'amit.verma@gmail.com', mobile: '+91 98765 43203', roomType: 'Standard', checkIn: '2025-06-10', checkOut: '2025-06-11', guests: 1, status: 'Cancelled', source: 'Online' },
  { _id: 'b4', name: 'Neha Singh', email: 'neha.singh@gmail.com', mobile: '+91 98765 43204', roomType: 'AC', checkIn: '2025-06-05', checkOut: '2025-06-07', guests: 2, status: 'Completed', source: 'Offline' },
  { _id: 'b5', name: 'Vikram Joshi', email: 'vikram.joshi@gmail.com', mobile: '+91 98765 43205', roomType: 'Premium', checkIn: '2025-06-20', checkOut: '2025-06-22', guests: 2, status: 'Pending', source: 'Online' },
]

export const SAMPLE_GALLERY = [
  { _id: 'g1', label: 'Exterior View', type: 'image', cat: 'Exterior', src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&q=80' },
  { _id: 'g2', label: 'Deluxe Room', type: 'image', cat: 'Rooms', src: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&q=80' },
  { _id: 'g3', label: 'Reception', type: 'image', cat: 'Reception', src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80' },
  { _id: 'g4', label: 'Dining Area', type: 'image', cat: 'Dining', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=80' },
  { _id: 'g5', label: 'Property Tour', type: 'video', cat: 'Videos', src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&q=80' },
  { _id: 'g6', label: 'Parking Area', type: 'image', cat: 'Parking', src: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80' },
]

export const SAMPLE_CONTACTS = [
  { _id: 'c1', name: 'Sanjay Mehta', email: 'sanjay.mehta@gmail.com', phone: '+91 99887 76651', subject: 'Room Booking', message: 'Do you have a family room available next weekend?', createdAt: '2025-06-01' },
  { _id: 'c2', name: 'Anita Rao', email: 'anita.rao@gmail.com', phone: '+91 99887 76652', subject: 'General Inquiry', message: 'Is parking available for larger vehicles?', createdAt: '2025-06-02' },
  { _id: 'c3', name: 'Deepak Nair', email: 'deepak.nair@gmail.com', phone: '+91 99887 76653', subject: 'Feedback', message: 'Had a wonderful stay last month. Thank you!', createdAt: '2025-06-03' },
]

export const SAMPLE_REVIEWS = [
  { _id: 'rv1', name: 'Arjun Sharma', rating: 5, comment: 'Wonderful stay! Spotless rooms and great staff.', status: 'Approved', createdAt: '2025-05-28' },
  { _id: 'rv2', name: 'Megha Kulkarni', rating: 4, comment: 'Good value for money, comfortable beds.', status: 'Pending', createdAt: '2025-06-02' },
  { _id: 'rv3', name: 'Imran Sheikh', rating: 5, comment: 'Felt like home. Will return for sure.', status: 'Pending', createdAt: '2025-06-04' },
]

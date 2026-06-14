import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './AdminLayout.jsx'
import RequireAuth from './RequireAuth.jsx'

const Login = lazy(() => import('./pages/Login.jsx'))
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const RoomsList = lazy(() => import('./pages/RoomsList.jsx'))
const RoomForm = lazy(() => import('./pages/RoomForm.jsx'))
const Bookings = lazy(() => import('./pages/Bookings.jsx'))
const GalleryManager = lazy(() => import('./pages/GalleryManager.jsx'))
const ContactInquiries = lazy(() => import('./pages/ContactInquiries.jsx'))
const ReviewsManager = lazy(() => import('./pages/ReviewsManager.jsx'))

function Fallback() {
  return <div className="p-10 text-slate-400">Loading…</div>
}

export default function AdminApp() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<RoomsList />} />
          <Route path="rooms/new" element={<RoomForm />} />
          <Route path="rooms/:id/edit" element={<RoomForm />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="contacts" element={<ContactInquiries />} />
          <Route path="reviews" element={<ReviewsManager />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  )
}

import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingButtons from './components/FloatingButtons.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import AppDownloadModal from './components/AppDownloadModal.jsx'

// Code splitting: each page is lazy-loaded
const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Rooms = lazy(() => import('./pages/Rooms.jsx'))
const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const Facilities = lazy(() => import('./pages/Facilities.jsx'))
const Booking = lazy(() => import('./pages/Booking.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))
const ManageBooking = lazy(() => import('./pages/ManageBooking.jsx'))

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <AppDownloadModal />
    </>
  )
}

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy">
      <div className="w-14 h-14 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        {isAdmin ? (
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        ) : (
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/facilities" element={<Facilities />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/manage-booking" element={<ManageBooking />} />
            </Routes>
          </PublicLayout>
        )}
      </Suspense>
    </>
  )
}

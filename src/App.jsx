import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import { NotificationProvider } from './context/NotificationContext'
import { SettingsProvider } from './context/SettingsContext'
import Home from './pages/Home'
import About from './pages/About'
import Companies from './pages/Companies'
import CompanyDetails from './pages/CompanyDetails'
import Drives from './pages/Drives'
import Announcements from './pages/Announcements'
import PreviousDrives from './pages/PreviousDrives'
import Contact from './pages/Contact'

import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import AdminCompanies from './admin/AdminCompanies'
import AddCompany from './admin/AddCompany'
import EditCompany from './admin/EditCompany'
import AdminDrives from './admin/AdminDrives'
import AddDrive from './admin/AddDrive'
import EditDrive from './admin/EditDrive'
import AdminAnnouncements from './admin/AdminAnnouncements'
import AddAnnouncement from './admin/AddAnnouncement'
import EditAnnouncement from './admin/EditAnnouncement'
import AdminSettings from './admin/AdminSettings'
import AdminTeam from './admin/AdminTeam'
import AdminPlacements from './admin/AdminPlacements'
import AdminArchive from './admin/AdminArchive'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route element={<SettingsProvider><NotificationProvider><PublicLayout /></NotificationProvider></SettingsProvider>}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route path="/drives" element={<Drives />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/previous-drives" element={<PreviousDrives />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Everything under /admin (except /admin/login above) requires a
          signed-in Firebase user whose users/{uid} Firestore doc has
          role === "ADMIN" — enforced by ProtectedRoute, and for real by
          Firestore Security Rules in Phase 10. */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="companies" element={<AdminCompanies />} />
        <Route path="companies/add" element={<AddCompany />} />
        <Route path="companies/edit/:id" element={<EditCompany />} />
        <Route path="drives" element={<AdminDrives />} />
        <Route path="drives/add" element={<AddDrive />} />
        <Route path="drives/edit/:id" element={<EditDrive />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="announcements/add" element={<AddAnnouncement />} />
        <Route path="announcements/edit/:id" element={<EditAnnouncement />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="placements" element={<AdminPlacements />} />
        <Route path="archive" element={<AdminArchive />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}

export default App

import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Public Pages
import Home from './pages/Home'
import About from './pages/About'
import AimScope from './pages/AimScope'
import EditorialBoard from './pages/EditorialBoard'
import CurrentIssue from './pages/CurrentIssue'
import Archives from './pages/Archives'
import AuthorGuidelines from './pages/AuthorGuidelines'
import SubmitPaper from './pages/SubmitPaper'
import Announcements from './pages/Announcements'
import Contact from './pages/Contact'
import ResearchCategories from './pages/ResearchCategories'
import ArticleProcessingCharges from './pages/ArticleProcessingCharges'
import FeeWaiverProgram from './pages/FeeWaiverProgram'
import SubscriptionPlans from './pages/SubscriptionPlans'
import PublishedPapers from './pages/PublishedPapers'
import PaperDetails from './pages/PaperDetails'

// Auth Pages (3 Portals)
import Login from './pages/Login'
import StaffLogin from './pages/StaffLogin'
import AdminLogin from './pages/AdminLogin'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'

// Role-based Dashboards
import AdminPanel from './pages/AdminPanel'
import StaffDashboard from './pages/StaffDashboard'
import MySubmissions from './pages/MySubmissions'
import SubmissionDetails from './pages/SubmissionDetails'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/aim-scope" element={<AimScope />} />
          <Route path="/editorial-board" element={<EditorialBoard />} />
          <Route path="/current-issue" element={<CurrentIssue />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/author-guidelines" element={<AuthorGuidelines />} />
          <Route path="/submit-paper" element={<SubmitPaper />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/research-categories" element={<ResearchCategories />} />
          <Route path="/apc" element={<ArticleProcessingCharges />} />
          <Route path="/fee-waiver" element={<FeeWaiverProgram />} />
          <Route path="/subscriptions" element={<SubscriptionPlans />} />
          <Route path="/published-papers" element={<PublishedPapers />} />
          <Route path="/paper/:id" element={<PaperDetails />} />

          {/* 3 Distinct Login Portals */}
          <Route path="/login" element={<Login />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Admin Protected Dashboard */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminPanel />
            </ProtectedRoute>
          } />

          {/* Staff Protected Dashboard */}
          <Route path="/staff" element={
            <ProtectedRoute staffOnly>
              <StaffDashboard />
            </ProtectedRoute>
          } />

          {/* Author Protected Dashboards */}
          <Route path="/my-submissions" element={
            <ProtectedRoute>
              <MySubmissions />
            </ProtectedRoute>
          } />
          <Route path="/submission/:id" element={
            <ProtectedRoute>
              <SubmissionDetails />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={<Navigate to="/my-submissions" replace />} />

          {/* Catch-all redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App

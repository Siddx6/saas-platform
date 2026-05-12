import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import GoogleCallback from './pages/auth/GoogleCallback'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import Onboarding from './pages/onboarding/Onboarding'
import AcceptInvite from './pages/onboarding/AcceptInvite'
import Dashboard from './pages/Dashboard'
import Reports from './pages/Reports'
import ReportDetail from './pages/ReportDetail'
import Workspace from './pages/settings/Workspace'
import Team from './pages/settings/Team'
import Billing from './pages/settings/Billing'
import Notifications from './pages/settings/Notifications'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/onboarding' element={<Onboarding />} />
        <Route path='/invite/:token' element={<AcceptInvite />} />
        <Route path='/auth/callback' element={<GoogleCallback />} />
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path='/' element={<Navigate to='/dashboard' />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/reports/:id' element={<ReportDetail />} />
            <Route path='/settings/workspace' element={<Workspace />} />
            <Route path='/settings/team' element={<Team />} />
            <Route path='/settings/billing' element={<Billing />} />
            <Route path='/settings/notifications' element={<Notifications />} />
          </Route>
        </Route>

        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}
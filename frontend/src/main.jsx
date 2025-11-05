import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ApplyLoan from './pages/ApplyLoan.jsx';
import Contribution from './pages/Contribution.jsx';
import LoanPayment from './pages/LoanPayment.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import ChangePassword from './pages/Admin/ChangePassword.jsx';
import Transaction from './pages/Transaction.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import Members from './pages/Admin/Members.jsx';
import LoanApproval from './pages/Admin/LoansApproval.jsx';
import Reminder from './pages/Admin/Reminder.jsx';
import AllContribution from './pages/Admin/AllContribution.jsx';
import { AuthContextProvider } from '../context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoutes.jsx';
import AllLoans from './pages/Admin/AllLoans.jsx';
import ContributionAdmin from './pages/Admin/ContributionAdmin.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/*" element={<App />} />
          <Route path="/loans" element={<ApplyLoan />} />
          <Route path="/contribution" element={<Contribution />} />
          <Route path="/loanPayment" element={<LoanPayment />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/transaction" element={<Transaction />} />

          {/* Member-only dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="member">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin-only dashboard */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/*  Admin-only routes */}
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute allowedRole="admin">
                <Members/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/loans"
            element={
              <ProtectedRoute allowedRole="admin">
                <LoanApproval />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/contributions"
            element={
              <ProtectedRoute allowedRole="admin">
                <AllContribution />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reminders"
            element={
              <ProtectedRoute allowedRole="admin">
                <Reminder />
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin/AllLoans"
            element={
              <ProtectedRoute allowedRole="admin">
                <AllLoans />
              </ProtectedRoute>
            }
          />

            <Route
            path="/admin/AllContributions"
            element={
              <ProtectedRoute allowedRole="admin">
                <ContributionAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>
);

import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ApplyLoan from './pages/ApplyLoan.jsx'
import Contribution from './pages/Contribution.jsx'
import LoanPayment from './pages/LoanPayment.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import { AuthContextProvider } from '../context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
     <BrowserRouter>
     <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<App />} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/loans' element={<ApplyLoan/>} />
        <Route path='/contribution' element={<Contribution/>} />
        <Route path='/loanPayment' element={<LoanPayment/>} />
        <Route path='/register' element={<Signup/>} />
        <Route path='/profile' element={<Profile/>} />
      
      
      </Routes>
    </BrowserRouter>
    </AuthContextProvider>
  </StrictMode>,

  
)

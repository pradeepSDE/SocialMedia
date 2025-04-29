import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import App from './App.jsx'
import Login from './components/auth/Login.jsx';
import Signup from './components/auth/Signup.jsx';
import Dashboard from './components/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path='/login' element= {<Login/>}/>
    <Route path='/signup' element= {<Signup/>}/>
    <Route path='/dashboard' element= {<Dashboard/>}/>
  </Routes>
</BrowserRouter>
)

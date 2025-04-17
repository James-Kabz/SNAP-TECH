import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './hooks/use-auth.tsx'
import { CartProvider } from './hooks/use-cart.tsx'
import LoginPage from './pages/login.tsx'
import AdminProductsPage from './pages/admin/products.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App />}/>
            <Route path='/login' element={<LoginPage />}/>
            <Route path='/adminProducts' element={<AdminProductsPage/>}/>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)
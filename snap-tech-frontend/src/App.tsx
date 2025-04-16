import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { Toaster } from './components/ui/sonner'
import { AuthProvider } from './hooks/use-auth'
import { CartProvider } from './hooks/use-cart'
import HomePage from './pages/home'

function App() {


  return (
    <BrowserRouter basename='/'>
    <AuthProvider>
    <Toaster />
    <CartProvider>
        <HomePage/>
    </CartProvider>
    </AuthProvider>
    </BrowserRouter>
  )
}

export default App

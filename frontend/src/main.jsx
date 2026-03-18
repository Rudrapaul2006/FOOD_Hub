import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { store } from './Clint/Redux/store'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <Toaster />
      </Provider>
    </BrowserRouter>
)

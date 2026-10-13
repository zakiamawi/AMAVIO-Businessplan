import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { ExternalApp } from './components/ExternalApp.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode><ExternalApp /></StrictMode>,
)

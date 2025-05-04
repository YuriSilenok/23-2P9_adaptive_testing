import { createRoot } from 'react-dom/client' 
import './styles/main.css'
import RoutePaths from './Static/Routes'
import  React from 'react'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RoutePaths />
  </React.StrictMode>
)

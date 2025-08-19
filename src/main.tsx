import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.tsx'
// Importa Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Importa estilos de la carpeta assets/css
import './assets/css/LineIcons.2.0.css';
import './assets/css/animate.css';
import './assets/css/tiny-slider.css';
import './assets/css/glightbox.min.css';
import './assets/css/main.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

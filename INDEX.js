import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Aquí importarías tus estilos globales o de reinicio
import App from './App';
import reportWebVitals from './reportWebVitals'; // Para medir el rendimiento web

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
require('dotenv').config(); // Carga las variables de entorno desde .env

const app = require('./app'); // Importa la configuración de Express desde app.js
const connectDB = require('./config/db'); // Importa la función de conexión a MongoDB

const PORT = process.env.PORT || 3000; // Define el puerto del servidor

// Conectar a la base de datos MongoDB
connectDB();

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor de GameTracker ejecutándose en el puerto ${PORT}`);
  console.log(`Accede a la API en: http://localhost:${PORT}`);
});
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import mapfreLogo from '../assets/mapfre-logo.png';
import sideImage from '../assets/side-illustration.png';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    correo: '',
    password: '',
  });
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // 👉 DEBUG: Imprimir URL de la API
    console.log('🌐 API:', import.meta.env.VITE_API_URL);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, {
        correo: formData.correo,
        password: formData.password,
      });

      const { nombre, rol, correo } = res.data;


      if (!nombre || !rol) {
        setMensaje('Respuesta inválida del servidor');
        return;
      }

      localStorage.setItem('rol', rol);
      localStorage.setItem('usuario', nombre);
      localStorage.setItem('nombreCompleto', nombre);
      localStorage.setItem('correo', formData.correo);

      


      if (rol === 'administrador'  || rol === 'administrador') {
        navigate('/ingeniero-dashboard');
      } else if (rol === 'suscriptor') {
        navigate('/suscriptor-dashboard');
      } else {
        alert('Rol no autorizado.');
      }
    } catch (err) {
      console.error('❌ Error al iniciar sesión:', err);
      setMensaje('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Imagen lateral */}
        <div className="w-1/2 bg-gray-200 flex items-center justify-center">
          <img src={sideImage} alt="Decoración" className="max-w-full h-auto p-6" />
        </div>

        {/* Formulario */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md p-8">
            <img src={mapfreLogo} alt="MAPFRE logo" className="w-30 mx-auto mb-6" />
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Iniciar sesión
            </h2>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#D81E05] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
              >
                Iniciar sesión
              </button>

              {mensaje && (
                <p className="text-red-500 text-sm mt-2 text-center">{mensaje}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

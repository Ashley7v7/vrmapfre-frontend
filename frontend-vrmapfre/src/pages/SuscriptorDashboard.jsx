import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapfreLogo from '../assets/mapfre-blanco.png';
import SolicitudVisita from './SolicitudVisita';
import TablaVisitas from '../components/TablaVisitas';
import Notificacion from '../components/Notificacion';
import toast from 'react-hot-toast';

export default function SuscriptorDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [notificaciones, setNotificaciones] = useState([]);
  const navigate = useNavigate();
  const toastsMostrados = useRef(new Set());

  useEffect(() => {
    const nombre = (localStorage.getItem('nombreCompleto') || '').toLowerCase().trim();
    const ahora = new Date();

    const normalizar = (str) =>
        (str || '').normalize('NFD').replace(/\s+/g, '').toLowerCase();

      const esMismoSuscriptor = (a, b) =>
        normalizar(a) === normalizar(b);


    const obtenerNotificaciones = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const res = await fetch(`${API_URL}/api/visitas`, {
          credentials: 'include'
        });
        const visitas = await res.json();
        const visitasLuisaVisitadas = visitas.filter(v =>
          v.estatus === "Visitada" &&
          v.suscriptor?.toLowerCase().includes("luisa")
        );

        console.log("🔍 Visitas visitadas de Luisa:", visitasLuisaVisitadas);


        console.log("📥 Visitas recibidas del backend:", visitas);

        const relevantes = visitas.filter((v) => {
          const mismoSuscriptor = esMismoSuscriptor(v.suscriptor, nombre);


          console.log("👤 Comparando suscriptores:", {
            nombreFrontend: nombre,
            nombreBD: v.suscriptor,

          });



          if (!mismoSuscriptor) return false;

          const estatus = v.estatus;

          if (estatus === 'Cancelada') {
            if (!v.fechaCancelacion) return false;
            const fecha = new Date(v.fechaCancelacion);
            const dias = (ahora - fecha) / (1000 * 60 * 60 * 24);
            return dias <= 2;
          }

          if (estatus === 'Visitada') {
            if (!v.fechaVisitada) {
              console.log('⛔ No tiene fechaVisitada:', v);
              return false;
            }

            const fecha = new Date(v.fechaVisitada);
            const dias = (ahora - fecha) / (1000 * 60 * 60 * 24);

            console.log('✅ Evaluando Visitada:', {
              asegurado: v.asegurado,
              fechaVisitada: v.fechaVisitada,
              dias
            });

            return dias <= 2;
          }



          return estatus === 'Agendada';
        });

        console.log("✅ Filtradas relevantes:", relevantes);

        const ordenadas = relevantes
          .filter(v => v.fechaVisita || v.fechaSolicitud || v.fecha)
          .sort((a, b) => {
            const fa = new Date(a.fechaVisita || a.fechaSolicitud || a.fecha);
            const fb = new Date(b.fechaVisita || b.fechaSolicitud || b.fecha);
            return fb - fa;
          });

        console.log('👀 DEBUG - Suscriptor actual:', nombre);
        console.log('📦 DEBUG - Notificaciones filtradas:', relevantes);
  
        setNotificaciones(ordenadas);

        ordenadas.forEach((v) => {
          const fecha = new Date(v.fechaVisita || v.fechaSolicitud || v.fecha).toISOString();
          const clave = `${v.estatus}-${v.asegurado}-${fecha}`;
          if (toastsMostrados.current.has(clave)) return;
          toastsMostrados.current.add(clave);

          const color =
            v.estatus === 'Cancelada' ? '#737373' :
            v.estatus === 'Visitada' ? '#15803d' :
            '#b59a00';

          toast.custom((t) => (
            <div
              className={`bg-white border-l-4 shadow-lg rounded-md px-4 py-3 mb-2 w-80 transition-transform duration-500 ease-out ${
                t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-5 scale-95'
              }`}
              style={{ borderColor: color, zIndex: 9999 }}
            >
              <p className="text-sm font-semibold text-gray-800">{v.estatus}</p>
              <p className="text-sm text-gray-600">
                {v.asegurado} | {new Date(v.fechaVisita || v.fechaSolicitud || v.fecha).toLocaleDateString()}
              </p>
            </div>
          ), {
            duration: 5000
          });
        });
      } catch (err) {
        console.error('❌ Error al obtener notificaciones:', err);
      }
    };

    obtenerNotificaciones();
  }, []);

  return (
    <div className="flex">
      {/* Toaster ya está en App.jsx */}

      <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-700 text-white flex flex-col justify-between z-10">
        <div>
          <div className="flex items-center justify-center py-6">
            <img src={mapfreLogo} alt="MAPFRE" className="w-32" />
          </div>
          <nav className="flex flex-col space-y-1 px-4">
            {['inicio', 'reportes', 'solicitud', 'visitas'].map((tab) => (
              <button
                key={tab}
                className={`text-left px-4 py-2 rounded ${activeTab === tab ? 'bg-gray-600' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'inicio'
                  ? 'Inicio'
                  : tab === 'reportes'
                  ? 'Reportes'
                  : tab === 'solicitud'
                  ? 'Solicitud de visita'
                  : 'Visitas programadas'}
              </button>
            ))}
          </nav>
        </div>
        <div className="px-4 pb-6">
          <button
            onClick={() => navigate('/')}
            className="w-full text-left px-4 py-2 rounded bg-transparent text-white hover:bg-gray-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="ml-64 w-full p-10 bg-gray-50 min-h-screen overflow-y-auto">
        {activeTab === 'inicio' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-800">Bienvenido, Suscriptor</h1>
              <Notificacion notificaciones={notificaciones} />
            </div>
            <p className="mt-2 text-gray-600">
              Aquí puedes acceder a los reportes generados por los Ingenieros de Riesgos.
            </p>
          </div>
        )}
        {activeTab === 'reportes' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Tus Reportes</h2>
            <p className="text-gray-600">Aquí se mostrarán los reportes disponibles para consulta.</p>
          </div>
        )}
        {activeTab === 'solicitud' && <SolicitudVisita />}
        {activeTab === 'visitas' && <TablaVisitas />}
      </main>
    </div>
  );
}

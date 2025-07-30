import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mapfreLogo from '../assets/mapfre-blanco.png';
import Notificacion from '../components/NotificacionIngeniero';
import toast from 'react-hot-toast';

import TablaVisitas from '../components/TablaVisitas';
import InfoGeneral from '../components/InfoGeneral';
import ResumenRiesgo from '../components/ResumenRiesgo';
import RiesgosCAT from '../components/RiesgosCAT';
import Inmueble from '../components/Inmueble';
import Actividad from '../components/Actividad';
import Gestion from '../components/Gestion';
import SeguridadPatrimonial from '../components/SeguridadPatrimonial';
import Control from '../components/Control';
import Itinerario from '../components/Itinerario';
import { generarPDFCompleto } from '../utils/generarPDF';
import SolicitudInspeccion from '../components/SolicitudInspeccion';

export default function IngenieroDashboard() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [activeSeccion, setActiveSeccion] = useState(null);
  const [notificaciones, setNotificaciones] = useState([]);
  const reporteRef = useRef(null);
  const navigate = useNavigate();
  const toastsMostrados = useRef(new Set());

  const [formValues, setFormValues] = useState({
    razonSocial: '', direccion: '', fechaVisita: '', suscriptor: '', ingeniero: '',
    sumaAsegurada: '', antecedenteFecha: '', territorial: '', poliza: '',
    actividadDeclarada: '', actividadEvaluada: '', actividadDiferente: '',
    tipoVisita: '', numeroAreas: '', areasDescripcion: [],
    descripcionRiesgo: '', tieneDictamen: '', daños: '', deterioro: '',
    siniestralidad: '', detalleSiniestralidad: '', observaciones: ''
  });

  const [catRiesgos, setCatRiesgos] = useState([
    { riesgo: 'Ciclones tropicales', nivel: '' },
    { riesgo: 'Inundaciones', nivel: '' },
    { riesgo: 'Sequías', nivel: '' },
    { riesgo: 'Tormentas eléctricas', nivel: '' },
    { riesgo: 'Granizo', nivel: '' },
    { riesgo: 'Ondas cálidas', nivel: '' },
    { riesgo: 'Bajas temperaturas', nivel: '' },
    { riesgo: 'Nevadas', nivel: '' },
    { riesgo: 'Sismo', nivel: '' },
    { riesgo: 'Laderas', nivel: '' },
    { riesgo: 'Caída de cenizas', nivel: '' },
  ]);

  useEffect(() => {
    const nombre = localStorage.getItem('nombreCompleto');
    const ahora = new Date();

    const obtenerNotificaciones = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/visitas');
        const visitas = await res.json();

        // 👇 Agrega este log
        console.log('TODAS las visitas recibidas:', visitas);

        // 👇 Agrega este log también para ver solo las canceladas
        const canceladas = visitas.filter(v => v.estatus === 'Cancelada');
        console.log('Visitas canceladas:', canceladas.map(v => ({
          asegurado: v.asegurado,
          fechaSolicitud: v.fechaSolicitud,
          fecha: v.fecha
        })));



        const relevantes = visitas.filter((v) => {
          const estatus = v.estatus;
          const mismoIngeniero =
            v.ingeniero?.toLowerCase() === nombre?.toLowerCase() ||
            (estatus === 'En espera' && (!v.ingeniero || v.ingeniero.trim() === ''));

          if (!mismoIngeniero) return false;

          const fechaCancelacion = new Date(v.fechaCancelacion || v.fechaSolicitud || v.fecha);

          const dias = isNaN(fechaCancelacion.getTime()) ? Infinity : (ahora - fechaCancelacion) / (1000 * 60 * 60 * 24);

          if (estatus === 'Cancelada') return dias <= 2;
          if (estatus === 'En espera') return true;
          return false;


          

          return false;
        });

        setNotificaciones(relevantes);

        relevantes.forEach((v) => {
          const clave = `${v.estatus}-${v.asegurado}-${v.fechaVisita || v.fecha}`;
          if (toastsMostrados.current.has(clave)) return;
          toastsMostrados.current.add(clave);

          const color =
            v.estatus === 'Cancelada' ? '#737373' :
            v.estatus === 'En espera' ? '#b91c1c' :
            '#d1d5db';

          toast.custom((t) => (
            <div className={`bg-white border-l-4 rounded-md shadow-lg px-4 py-3 mb-2 w-80 transition-all duration-500 transform ${
              t.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`} style={{ borderColor: color }}>
              <p className="text-sm font-semibold text-gray-800">{v.estatus}</p>
              <p className="text-sm text-gray-700">
                {v.asegurado} | {new Date(v.fechaVisita || v.fechaSolicitud || v.fecha).toLocaleDateString()}
              </p>
            </div>
          ));
        });
      } catch (err) {
        console.error('Error al obtener notificaciones del ingeniero:', err);
      }
    };

    obtenerNotificaciones();
  }, []);


  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const secciones = [
    'Información General', 'Resumen del Riesgo', 'Riesgos CAT',
    'Inmueble', 'Actividad', 'Gestión',
    'Seguridad Patrimonial', 'Control'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (index, value) => {
    const newAreas = [...formValues.areasDescripcion];
    newAreas[index] = value;
    setFormValues((prev) => ({ ...prev, areasDescripcion: newAreas }));
  };

  const handleNivelChange = (index, value) => {
    const updatedRiesgos = [...catRiesgos];
    updatedRiesgos[index].nivel = value;
    setCatRiesgos(updatedRiesgos);
  };

  const calcularCalificacion = () => {
    const niveles = { 'Muy Bajo': 1, 'Bajo': 2, 'Medio': 3, 'Alto': 4, 'Muy Alto': 5 };
    const valores = catRiesgos.filter(r => r.nivel).map(r => niveles[r.nivel] || 0);
    if (valores.length === 0) return "Sin evaluar";
    const promedio = valores.reduce((a, b) => a + b, 0) / valores.length;
    if (promedio <= 1.5) return "Muy Bajo";
    if (promedio <= 2.5) return "Bajo";
    if (promedio <= 3.5) return "Medio";
    if (promedio <= 4.5) return "Alto";
    return "Muy Alto";
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-[#D81E05] text-white flex flex-col items-center py-8">
        <img src={mapfreLogo} alt="MAPFRE" className="w-32 mb-8" />
        {['inicio', 'itinerario', 'visitas', 'solicitudes', 'reportes'].map((tab) => (
          <button
            key={tab}
            className={`w-full py-3 px-4 text-left hover:bg-red-800 ${activeTab === tab ? 'bg-red-800' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'inicio'
              ? 'Inicio'
              : tab === 'itinerario'
              ? 'Itinerario'
              : tab === 'visitas'
              ? 'Visitas Programadas'
              : tab === 'solicitudes'
              ? 'Solicitudes de Inspección'
              : 'Reportes'}
          </button>
        ))}

        <button className="w-full mt-auto py-3 px-4 text-left hover:bg-red-800" onClick={handleLogout}>Cerrar sesión</button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'inicio' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold text-gray-800">Bienvenido, Ingeniero de Riesgos</h1>
              <Notificacion notificaciones={notificaciones} />
            </div>
            <p className="text-lg text-gray-700">Aquí puedes acceder a tus herramientas de evaluación y reportes.</p>
          </div>
        )}
        {activeTab === 'itinerario' && <Itinerario />}
        {activeTab === 'visitas' && <TablaVisitas />}
        {activeTab === 'solicitudes' && <SolicitudInspeccion />}

        {activeTab === 'reportes' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Reportes</h2>
            <button
              onClick={() => setActiveTab('crear-reporte')}
              className="mb-4 bg-[#D81E05] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Crear Nuevo Reporte
            </button>
          </div>
        )}
        {activeTab === 'crear-reporte' && (
          <div>
            <button
              onClick={() => generarPDFCompleto(formValues, reporteRef)}
              className="mb-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded"
            >
              Generar PDF del Reporte
            </button>

            <div ref={reporteRef}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Crear Reporte</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {secciones.map((seccion, idx) => (
                  <button
                    key={idx}
                    className={`border rounded p-3 text-center text-sm font-medium shadow hover:bg-gray-100 ${activeSeccion === seccion ? 'bg-gray-200' : 'bg-white'}`}
                    onClick={() => setActiveSeccion(seccion)}
                  >
                    {idx + 1}. {seccion}
                  </button>
                ))}
              </div>

              {activeSeccion === 'Información General' && (
                <InfoGeneral formValues={formValues} handleInputChange={handleInputChange} />
              )}
              {activeSeccion === 'Resumen del Riesgo' && (
                <ResumenRiesgo
                  formValues={formValues}
                  handleInputChange={handleInputChange}
                  handleAreaChange={handleAreaChange}
                />
              )}
              {activeSeccion === 'Riesgos CAT' && (
                <RiesgosCAT
                  catRiesgos={catRiesgos}
                  handleNivelChange={handleNivelChange}
                  calcularCalificacion={calcularCalificacion}
                />
              )}
              {activeSeccion === 'Inmueble' && <Inmueble />}
              {activeSeccion === 'Actividad' && <Actividad />}
              {activeSeccion === 'Gestión' && <Gestion />}
              {activeSeccion === 'Seguridad Patrimonial' && <SeguridadPatrimonial />}
              {activeSeccion === 'Control' && <Control />}
            
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

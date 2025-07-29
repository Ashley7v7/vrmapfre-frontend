import React, { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificacionIngeniero({ notificaciones }) {
  const [mostrarLista, setMostrarLista] = useState(false);
  const contenedorRef = useRef();

  const toggleLista = () => setMostrarLista(!mostrarLista);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contenedorRef.current && !contenedorRef.current.contains(event.target)) {
        setMostrarLista(false);
      }
    };
    const handleScroll = () => setMostrarLista(false);

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const filtrarNotificaciones = (lista) => {
    const ahora = new Date();

    return lista.filter((n) => {
      if (n.estatus === 'En espera') return true;

      if (n.estatus === 'Cancelada') {
        const fecha = new Date(n.fechaCancelacion || n.fechaSolicitud || n.fecha);

        if (isNaN(fecha.getTime())) return false;
        const dias = Math.floor((ahora - fecha) / (1000 * 60 * 60 * 24));
        return dias <= 2;
      }

      return false;
    }).sort((a, b) =>
      new Date(b.fechaVisita || b.fechaSolicitud || b.fecha) -
      new Date(a.fechaVisita || a.fechaSolicitud || a.fecha)
    );
  };

  const visibles = filtrarNotificaciones(notificaciones);

  return (
    <div className="relative" ref={contenedorRef}>
      <div onClick={toggleLista} className="cursor-pointer">
        <Bell className="w-6 h-6 text-gray-700" />
        {visibles.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded-full">
            {visibles.length}
          </span>
        )}
      </div>

      {mostrarLista && (
        <div className="absolute right-0 mt-2 w-72 z-30 max-h-96 overflow-y-auto space-y-2">
          {visibles.length === 0 ? (
            <p className="p-3 text-sm text-gray-500">No hay notificaciones</p>
          ) : (
            visibles.map((n, i) => {
              const color =
                n.estatus === 'Cancelada' ? '#737373' :
                n.estatus === 'En espera' ? '#b91c1c' :
                '#d1d5db';

              return (
                <div
                  key={i}
                  className="shadow-lg rounded-md p-3 w-full border-l-4 animate-fade-in"
                  style={{ borderColor: color }}
                >
                  <p className="text-sm font-semibold text-gray-800">{n.estatus}</p>
                  <p className="text-sm text-gray-700">
                    {n.asegurado} |{' '}
                    {new Date(n.fechaVisita || n.fechaSolicitud || n.fecha).toLocaleDateString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

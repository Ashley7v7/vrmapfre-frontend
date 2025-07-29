import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function Itinerario() {
  const calendarRef = useRef(null);
  const [eventos, setEventos] = useState([]);
  const [fechaCalendario, setFechaCalendario] = useState(new Date());
  const [visitasSeleccionadas, setVisitasSeleccionadas] = useState([]);
  const [conteoEstatus, setConteoEstatus] = useState({ visitada: 0, agendada: 0, espera: 0, cancelada: 0 });

  const [anioFiltro, setAnioFiltro] = useState('');
  const [mesFiltro, setMesFiltro] = useState('');
  const [visitasTotales, setVisitasTotales] = useState([]);
  const [ingenierosDB, setIngenierosDB] = useState([]);

  const [ingenieroSeleccionadoCalendario, setIngenieroSeleccionadoCalendario] = useState('');

  useEffect(() => {
    const cargarVisitas = async () => {
      try {
        // primero verifica visitas vencidas
        await fetch('http://localhost:3000/api/verificar-visitas', {
          method: 'PUT'
        });

        // luego carga todas las visitas actualizadas
        const res = await fetch('http://localhost:3000/api/visitas');
        const data = await res.json();

        const eventosFormateados = data
          .filter(v => v.estatus !== 'Cancelada')
          .map((v) => ({
            title: v.asegurado,
            date: new Date(v.fechaVisita).toISOString().split('T')[0],
            color: v.estatus === 'Visitada' ? '#bbf7d0' : '#fef9c3',
            extendedProps: {
              ingeniero: v.ingeniero,
              estatus: v.estatus
            }
          }));

        setEventos(eventosFormateados);
        setVisitasTotales(data);

        const conteo = { visitada: 0, agendada: 0, espera: 0, cancelada: 0 };
        data.forEach((v) => {
          if (v.estatus === 'Visitada') conteo.visitada++;
          else if (v.estatus === 'Agendada') conteo.agendada++;
          else if (v.estatus === 'En espera') conteo.espera++;
          else if (v.estatus === 'Cancelada') conteo.cancelada++;
        });

        setConteoEstatus(conteo);
      } catch (error) {
        console.error('Error al cargar visitas en Itinerario:', error);
      }
    };

    cargarVisitas();
  }, []);




  useEffect(() => {
    fetch('http://localhost:3000/api/ingenieros')
      .then(res => res.json())
      .then(data => setIngenierosDB(data.map(i => i.nombre)))
      .catch(err => console.error('Error al cargar ingenieros:', err));
  }, []);

  const renderEventContent = (eventInfo) => {
    const estatus = eventInfo.event.extendedProps.estatus;
    const color =
      estatus === 'Visitada' ? 'bg-[#DCFCE7]' :
      estatus === 'Agendada' ? 'bg-[#FFF9DB]' :
      estatus === 'En espera' ? 'bg-[#FFE4E6]' : '';

    return (
      <div className={`text-xs px-1 py-0.5 rounded ${color} text-gray-800`}>
        <strong>{eventInfo.event.title}</strong><br />
        <span className="italic text-gray-600 text-[10px]">
          {eventInfo.event.extendedProps.ingeniero || 'Sin ingeniero'}
        </span>
      </div>
    );
  };

  const cambiarMes = (e) => {
    const nuevoMes = parseInt(e.target.value);
    const nuevaFecha = new Date(fechaCalendario);
    nuevaFecha.setMonth(nuevoMes);
    setFechaCalendario(nuevaFecha);
    calendarRef.current.getApi().gotoDate(nuevaFecha);
  };

  const cambiarAnio = (e) => {
    const nuevoAnio = parseInt(e.target.value);
    if (!isNaN(nuevoAnio)) {
      const nuevaFecha = new Date(fechaCalendario);
      nuevaFecha.setFullYear(nuevoAnio);
      calendarRef.current.getApi().gotoDate(nuevaFecha);
    }
  };

  const handleDateClick = (info) => {
    const fechaSeleccionada = info.dateStr;
    const visitas = eventos.filter(v => v.date === fechaSeleccionada);
    setVisitasSeleccionadas(visitas);
  };

  const visitasFiltradas = visitasTotales
    .filter(v => v.estatus === 'Visitada')
    .filter(v => {
      const fecha = new Date(v.fechaVisita || v.fecha || '');
      const cumpleMes = mesFiltro === '' || fecha.getMonth() === parseInt(mesFiltro);
      const cumpleAnio = anioFiltro === '' || fecha.getFullYear().toString() === anioFiltro;
      return cumpleMes && cumpleAnio;
    });

  const visitasAgrupadas = ingenierosDB.reduce((acc, nombre) => {
    const cantidad = visitasFiltradas.filter(v => v.ingeniero === nombre).length;
    acc[nombre] = cantidad;
    return acc;
  }, {});

  visitasFiltradas.forEach(v => {
    if (!v.ingeniero || !ingenierosDB.includes(v.ingeniero)) {
      const nombre = v.ingeniero || 'Sin asignar';
      visitasAgrupadas[nombre] = (visitasAgrupadas[nombre] || 0) + 1;
    }
  });

  const ingenierosAMostrar = ingenieroSeleccionadoCalendario
    ? { [ingenieroSeleccionadoCalendario]: visitasAgrupadas[ingenieroSeleccionadoCalendario] || 0 }
    : visitasAgrupadas;

  return (
    <div className="max-w-6xl mx-auto p-4 text-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Itinerario de Visitas</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-[#DCFCE7] p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{conteoEstatus.visitada}</p>
          <p className="text-sm text-gray-700">Visitadas</p>
        </div>
        <div className="bg-[#FFF9DB] p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{conteoEstatus.agendada}</p>
          <p className="text-sm text-gray-700">Agendadas</p>
        </div>
        <div className="bg-[#FFE4E6] p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{conteoEstatus.espera}</p>
          <p className="text-sm text-gray-700">En espera</p>
        </div>
        <div className="bg-gray-300 p-4 rounded shadow text-center">
          <p className="text-lg font-semibold">{conteoEstatus.cancelada}</p>
          <p className="text-sm text-gray-700">Canceladas</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <select onChange={cambiarMes} value={fechaCalendario.getMonth()} className="border p-2 rounded text-sm bg-gray-50">
          {meses.map((mes, idx) => (
            <option key={mes} value={idx}>{mes}</option>
          ))}
        </select>
        <input
          type="number"
          value={fechaCalendario.getFullYear()}
          onChange={cambiarAnio}
          className="border p-2 rounded text-sm bg-gray-50 w-24"
        />
      </div>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        locale={esLocale}
        initialView="dayGridMonth"
        events={
          ingenieroSeleccionadoCalendario
            ? eventos.filter(e => (e.extendedProps.ingeniero || '') === ingenieroSeleccionadoCalendario)
            : eventos
        }
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        initialDate={fechaCalendario}
        height="auto"
        headerToolbar={false}
        dayHeaderClassNames={() => 'bg-gray-200 text-gray-700 font-medium'}
        eventClassNames={() => 'border-none'}
      />



      <div className="mt-10 bg-gray-50 p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-gray-800">Visitas realizadas por Ingeniero</h4>
          <div className="bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full shadow-sm flex items-center">
            Total:&nbsp;
            <span className="font-semibold text-blue-700">
              {ingenieroSeleccionadoCalendario
                ? ingenierosAMostrar[ingenieroSeleccionadoCalendario] || 0
                : visitasFiltradas.length}
            </span>&nbsp;visita(s)
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <input
            type="number"
            placeholder="Filtrar por año"
            className="border p-1 rounded"
            onChange={(e) => setAnioFiltro(e.target.value)}
          />
          <select
            className="border p-1 rounded"
            onChange={(e) => setMesFiltro(e.target.value)}
          >
            <option value="">Todos los meses</option>
            {meses.map((mes, i) => (
              <option key={mes} value={i}>{mes}</option>
            ))}
          </select>
          {ingenieroSeleccionadoCalendario && (
            <button
              onClick={() => setIngenieroSeleccionadoCalendario('')}
              className="ml-auto bg-gray-200 hover:bg-gray-300 text-sm text-gray-700 px-3 py-1 rounded-full shadow"
            >
              ✕ Quitar filtro de ingeniero
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(ingenierosAMostrar).map(([nombre, cantidad]) => (
            <div
              key={nombre}
              onClick={() => setIngenieroSeleccionadoCalendario(nombre)}
              className={`cursor-pointer bg-white border rounded shadow p-4 flex items-center justify-between hover:bg-blue-50 transition ${
                ingenieroSeleccionadoCalendario === nombre ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <div>
                <p className="text-sm text-gray-500">Ingeniero</p>
                <h5 className="text-base font-semibold text-gray-800">{nombre}</h5>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Visitas</p>
                <span className={`text-lg font-bold ${cantidad > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {cantidad}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {visitasSeleccionadas.length > 0 && (
        <div className="mt-6 bg-gray-50 border rounded p-4">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">
            Visitas el {visitasSeleccionadas[0].date}
          </h4>
          <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
            {visitasSeleccionadas.map(v => (
              <li key={`${v.date}-${v.title}`}>
                <strong>{v.title}</strong> — Ingeniero: <em>{v.extendedProps.ingeniero || 'Sin asignar'}</em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

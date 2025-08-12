import React, { useEffect, useState } from 'react';
import { estadosConMunicipios } from '../data/estados_municipios_completo';
const API_URL = import.meta.env.VITE_API_URL;


export default function TablaVisitas() {

  const [visitas, setVisitas] = useState([]);
  const [filtros, setFiltros] = useState({});
  const [orden, setOrden] = useState({ campo: '', direccion: '' });
  const [ingenieros, setIngenieros] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  const [municipiosDisponibles, setMunicipiosDisponibles] = useState([]);
  const nombreIngeniero = localStorage.getItem('nombreCompleto') || '';
  
  const rolUsuario = localStorage.getItem('rol');

  



  const cargarVisitas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/visitas`);
      const data = await res.json();
      setVisitas(data); // 👈 Aquí está lo importante
    } catch (error) {
      console.error('Error al cargar visitas desde backend:', error);
    }
  };


  useEffect(() => {
    cargarVisitas();
  }, []);



  useEffect(() => {
    fetch(`${API_URL}/api/ingenieros`)
      .then((res) => res.json())
      .then((data) => {
        setIngenieros(data.map((i) => i.nombre));
      })
      .catch((err) => console.error('Error al cargar ingenieros:', err));
  }, []);

  const eliminarVisita = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta visita?')) return;

    try {
      const res = await fetch(`${API_URL}/api/visitas/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Error al eliminar en backend');

      // Si se elimina correctamente, recarga desde servidor
      await cargarVisitas();
    } catch (error) {
      console.error('Error al eliminar visita:', error);
      alert('No se pudo eliminar la visita. Intenta de nuevo.');
    }
  };


  const agendarVisita = async (id, nuevaFecha) => {
    const ingeniero = nombreIngeniero || 'Sin asignar';

    try {
      // ⏰ Corrige desfase de zona horaria agregando hora explícita
      const fechaForzada = new Date(`${nuevaFecha}T12:00:00`).toISOString();

      // Actualiza en backend
      const res = await fetch(`${API_URL}/api/visitas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fechaVisita: fechaForzada,
          estatus: 'Agendada',
          ingeniero: ingeniero
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar la visita');

      // Actualiza en frontend también
      const nuevasVisitas = visitas.map((v) =>
        v.id === id
          ? { ...v, fechaVisita: fechaForzada, estatus: 'Agendada', ingeniero }
          : v
      );

      setVisitas(nuevasVisitas);
      localStorage.setItem('visitas', JSON.stringify(nuevasVisitas));

    } catch (error) {
      console.error('Error al agendar visita:', error);
      alert('Error al guardar la fecha de visita. Intenta de nuevo.');
    }
  };



  const handleFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor.toLowerCase() }));
  };

  const handleOrdenar = (campo) => {
    setOrden((prev) => ({
      campo,
      direccion: prev.campo === campo && prev.direccion === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columnas = [
    { key: 'estatus', label: 'Estatus' },
    { key: 'fechaSolicitud', label: 'Fecha de Solicitud' },
    { key: 'asegurado', label: 'Asegurado' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'municipio', label: 'Municipio' },
    { key: 'estado', label: 'Estado' },
    { key: 'cobertura', label: 'Cobertura' },
    { key: 'giro', label: 'Giro' },
    { key: 'fechaVisita', label: 'Fecha de Visita' },
    { key: 'suscriptor', label: 'Suscriptor' },
    { key: 'ingeniero', label: 'Ingeniero' },
  ];

  const getEstatusColor = (estatus) => {
    switch (estatus) {
      case 'En espera': return 'bg-[#FFE4E6]';
      case 'Agendada': return 'bg-[#FFF9DB]';
      case 'Visitada': return 'bg-[#DCFCE7]';
      case 'Cancelada': return 'bg-gray-300 text-white';
      default: return '';
    }
  };
  
    const cambiarEstatus = async (id, nuevoEstatus) => {
    try {
      const payload = { estatus: nuevoEstatus };

      if (nuevoEstatus === 'Visitada') {
        const hoy = new Date();
        hoy.setHours(12, 0, 0, 0); // Establece hora 12:00 PM local
        payload.fechaVisitada = hoy.toISOString(); // 👈 ESTO ES CRUCIAL
      }

      if (nuevoEstatus === 'Cancelada') {
        payload.fechaCancelacion = new Date().toISOString();
      }

      console.log("📤 Payload enviado al backend:", payload);

      const res = await fetch(`${API_URL}/api/visitas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Error al cambiar estatus');
      await cargarVisitas();
    } catch (error) {
      console.error('Error al cambiar estatus:', error);
    }
  };




  const visitasFiltradas = visitas.filter((v) =>
    Object.entries(filtros).every(([campo, valor]) =>
      !valor || valor === 'todos' || (v[campo] || '').toString().toLowerCase().includes(valor)
    )
  );


  const visitasOrdenadas = [...visitasFiltradas].sort((a, b) => {
    const { campo, direccion } = orden;
    if (!campo) return 0;
    const aVal = (a[campo] || '').toString().toLowerCase();
    const bVal = (b[campo] || '').toString().toLowerCase();
    if (aVal < bVal) return direccion === 'asc' ? -1 : 1;
    if (aVal > bVal) return direccion === 'asc' ? 1 : -1;
    return 0;
  });

  const getFlechaOrden = (campo) => {
    if (orden.campo !== campo) return '';
    return orden.direccion === 'asc' ? ' 🔼' : ' 🔽';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Visitas Programadas</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columnas.map(({ key, label }) => (
                <th
                  key={key}
                  className="border px-2 py-1 cursor-pointer select-none"
                  onClick={() => handleOrdenar(key)}
                >
                  {label}{getFlechaOrden(key)}
                </th>
              ))}
              <th className="border px-2 py-1">Acciones</th>
            </tr>
            <tr>
              {columnas.map(({ key }) => (
                <th key={key} className="border px-2 py-1">
                  {key === 'estatus' ? (
                    <select onChange={(e) => handleFiltro(key, e.target.value)} className="w-full">
                      <option value="">Todos</option>
                      <option value="En espera">En espera</option>
                      <option value="Agendada">Agendada</option>
                      <option value="Visitada">Visitada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  ) : key === 'ingeniero' ? (
                    <select onChange={(e) => handleFiltro(key, e.target.value)} className="w-full">
                      <option value="">Todos</option>
                      {ingenieros.map((nombre) => (
                        <option key={nombre} value={nombre}>{nombre}</option>
                      ))}
                    </select>
                  ) : key === 'estado' ? (
                    <select
                      onChange={(e) => {
                        const estado = e.target.value;
                        handleFiltro('estado', estado);
                        setEstadoSeleccionado(estado);
                        setMunicipiosDisponibles(estadosConMunicipios[estado] || []);
                      }}
                      className="w-full"
                    >
                      <option value="">Todos</option>
                      {Object.keys(estadosConMunicipios).map((estado) => (
                        <option key={estado} value={estado}>{estado}</option>
                      ))}
                    </select>
                  ) : key === 'municipio' ? (
                    <select
                      onChange={(e) => handleFiltro('municipio', e.target.value)}
                      className="w-full"
                      disabled={!estadoSeleccionado}
                    >
                      <option value="">Todos</option>
                      {municipiosDisponibles.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="w-full"
                      placeholder="Filtrar"
                      onChange={(e) => handleFiltro(key, e.target.value)}
                    />
                  )}
                </th>
              ))}
              <th className="border px-2 py-1"></th>
            </tr>
          </thead>

          <tbody>
            {visitasOrdenadas.map((visita) => (
              <tr key={visita.id} className={getEstatusColor(visita.estatus)}>
                {columnas.map(({ key }) => (
                  <td key={key} className="border px-4 py-2">
                    {key === 'estatus' ? (
                      visita.estatus === 'Cancelada' ? (
                        <span className="font-semibold">Cancelada</span>
                      ) : (
                        <select
                          value={visita.estatus}
                          onChange={(e) => {
                            const nuevo = e.target.value;
                            if (nuevo === 'Cancelada' || nuevo === 'Visitada') {
                              cambiarEstatus(visita.id, nuevo);
                            }
                          }}
                          className="border rounded px-2 py-1"
                        >
                          <option value={visita.estatus}>{visita.estatus}</option>
                          <option value="Visitada">Visitada</option>
                          <option value="Cancelada">Cancelada</option>
                        </select>

                      )
                    ) : key === 'fechaVisita' ? (
                      rolUsuario === 'administrador' && (visita.estatus === 'En espera' || visita.estatus === 'Agendada') ? (
                        <input
                          type="date"
                          value={visita.fechaVisita ? new Date(visita.fechaVisita).toISOString().split('T')[0] : ''}
                          onChange={(e) => agendarVisita(visita.id, e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        <span>
                          {visita.fechaVisita
                            ? new Date(visita.fechaVisita).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })
                            : '-'}
                        </span>
                      )
                                    ) : key === 'ingeniero' && rolUsuario === 'administrador' ? (
                      <select
                        value={visita.ingeniero || ''}
                        onChange={async (e) => {
                          const nuevoIngeniero = e.target.value;
                          try {
                            const res = await fetch(`${API_URL}/api/visitas/${visita.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ ingeniero: nuevoIngeniero })
                            });
                            if (!res.ok) throw new Error('Error al actualizar ingeniero');

                            setVisitas(prev =>
                              prev.map(v => v.id === visita.id ? { ...v, ingeniero: nuevoIngeniero } : v)
                            );
                          } catch (error) {
                            console.error('Error al cambiar ingeniero:', error);
                            alert('No se pudo actualizar el ingeniero.');
                          }
                        }}
                        className="border rounded px-2 py-1"
                      >
                        <option value="">-- Seleccionar --</option>
                        {ingenieros.map(nombre => (
                          <option key={nombre} value={nombre}>{nombre}</option>
                        ))}
                      </select>
                    ) : (
                      visita[key] || '-'
                    )}
                  </td>
                ))}
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => eliminarVisita(visita.id)}
                    className="text-red-600 hover:underline"
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

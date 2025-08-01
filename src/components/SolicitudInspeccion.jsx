import React, { useEffect, useState } from 'react';

export default function SolicitudInspeccion() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [añoSeleccionado, setAñoSeleccionado] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);
  const [razonFiltro, setRazonFiltro] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('generales');
  const [razonesUnicas, setRazonesUnicas] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/solicitudes`)
      .then(res => res.json())
      .then(data => {
        setSolicitudes(data);
        const razones = [...new Set(data.map(s => s.razonSocial))];
        setRazonesUnicas(razones);
      })
      .catch(err => console.error('Error al cargar solicitudes:', err));
  }, []);

  function mostrarVigencia(inicio, termino) {
    const fechaInicio = (inicio && inicio !== 'N/A') ? new Date(inicio).toLocaleDateString('es-MX') : 'Sin fecha';
    const fechaTermino = (termino && termino !== 'N/A') ? new Date(termino).toLocaleDateString('es-MX') : 'Sin fecha';
    return `${fechaInicio} a ${fechaTermino}`;
  }





  function agruparPorAñoMes(lista) {
    const resultado = {};
    lista.forEach(item => {
      const fecha = new Date(item.fechaSolicitud);
      const año = fecha.getFullYear();
      const mes = fecha.toLocaleString('es-MX', { month: 'long' });
      if (!resultado[año]) resultado[año] = {};
      if (!resultado[año][mes]) resultado[año][mes] = [];
      resultado[año][mes].push(item);
    });
    return resultado;
  }

  const agrupadas = agruparPorAñoMes(solicitudes);

  const solicitudesFiltradas = razonFiltro
    ? solicitudes.filter(s =>
        s.razonSocial.toLowerCase().includes(razonFiltro.toLowerCase())
      )
    : solicitudes;

  const agrupadasFiltradas = agruparPorAñoMes(solicitudesFiltradas);

  const mesesDisponibles = añoSeleccionado ? Object.keys(agrupadasFiltradas[añoSeleccionado] || {}) : [];

  const solicitudesMostrar =
    añoSeleccionado && mesSeleccionado
      ? agrupadasFiltradas[añoSeleccionado]?.[mesSeleccionado] || []
      : [];

  const secciones = [
    { id: 'generales', label: 'Datos Generales' },
    { id: 'contacto', label: 'Datos de Contacto' },
    { id: 'interes', label: 'Rubros de Interés' },
    { id: 'ubicaciones', label: 'Ubicaciones' }
  ];

 
  console.log("🧐 Datos seleccionada:", seleccionada);


  function mostrarCampo(valor) {
    if (!valor || valor.trim() === '' || valor.trim().toUpperCase() === 'N/A') {
      return 'Sin especificar';
    }
    return valor;
  }



  if (seleccionada) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Solicitud de Inspección</h2>
          <button
            onClick={() => {
              setSeleccionada(null);
              setSeccionActiva('generales');
            }}
            className="border border-red-600 text-red-600 px-4 py-2 rounded hover:bg-red-100 transition"
          >
            ← Volver al listado
          </button>
        </div>

        <div className="flex space-x-2 mb-6">
          {secciones.map(sec => (
            <button
              key={sec.id}
              className={`px-4 py-2 border font-semibold transition ${
                seccionActiva === sec.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-700 border-red-700'
              }`}
              onClick={() => setSeccionActiva(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </div>

        {seccionActiva === 'generales' && (
          <div className="bg-gray-50 border rounded p-4 space-y-2">
            <p><strong>Razón Social:</strong> {mostrarCampo(seleccionada.razonSocial)}</p>
            <p><strong>Monto de Prima:</strong> 
              {mostrarCampo(seleccionada.monto)} {mostrarCampo(seleccionada.moneda)}
            </p>
            <p><strong>Giro:</strong> {mostrarCampo(seleccionada.giro)}</p>
            <p><strong>Tipo de Negocio:</strong> {mostrarCampo(seleccionada.tipoNegocio)}</p>
            <p><strong>Póliza:</strong> {mostrarCampo(seleccionada.poliza)}</p>
            <p>
              <strong>Vigencia:</strong> {mostrarVigencia(seleccionada.vigenciaInicio, seleccionada.vigenciaTermino)}
            </p>

            <p><strong>Tipo de Visita:</strong> {mostrarCampo(seleccionada.tipoVisita)}</p>
            <p><strong>Suscriptor:</strong> {mostrarCampo(seleccionada.suscriptor)}</p>
            <p><strong>Teléfono del Suscriptor:</strong> {mostrarCampo(seleccionada.telSuscriptor)}</p>
            <p><strong>Correo del Suscriptor:</strong> {mostrarCampo(seleccionada.correoSuscriptor)}</p>
            <p><strong>Coordinador:</strong> {mostrarCampo(seleccionada.coordinador)}</p>
            <p><strong>Correo del Coordinador:</strong> {mostrarCampo(seleccionada.correoCoordinador)}</p>
            <p><strong>Teléfono del Coordinador:</strong> {mostrarCampo(seleccionada.telCoordinador)}</p>
            <p><strong>Territorial:</strong> {mostrarCampo(seleccionada.territorial)}</p>
            {seleccionada.territorial === 'Otra' && (
              <p><strong>Especificación Territorial:</strong> {mostrarCampo(seleccionada.territorialOtra)}</p>
            )}
            <p><strong>Representante Comercial:</strong> {mostrarCampo(seleccionada.representante)}</p>
            <p><strong>Correo del Representante:</strong> {mostrarCampo(seleccionada.correoRepresentante)}</p>
            <p><strong>Teléfono del Representante:</strong> {mostrarCampo(seleccionada.telRepresentante)}</p>
          </div>
        )}






        {seccionActiva === 'contacto' && (
          <div className="space-y-4">
            <div className="bg-gray-50 border rounded p-4">
              <p className="font-semibold text-red-700 mb-1">Asegurado</p>
              <p><strong>Nombre:</strong> {mostrarCampo(seleccionada.contacto?.nombreAsegurado)}</p>
              <p><strong>Puesto:</strong> {seleccionada.contacto?.puestoAsegurado}</p>
              <p><strong>Teléfono:</strong> {seleccionada.contacto?.telAsegurado}</p>
              <p><strong>Correo:</strong> {seleccionada.contacto?.correoAsegurado}</p>
            </div>
            <div className="bg-gray-50 border rounded p-4">
              <p className="font-semibold text-red-700 mb-1">Agente / Broker</p>
              <p><strong>Nombre:</strong> {seleccionada.contacto?.nombreAgente}</p>
              <p><strong>Puesto:</strong> {seleccionada.contacto?.puestoAgente}</p>
              <p><strong>Teléfono:</strong> {seleccionada.contacto?.telAgente}</p>
              <p><strong>Correo:</strong> {seleccionada.contacto?.correoAgente}</p>
            </div>
          </div>
        )}

        {seccionActiva === 'interes' && (
          <div className="bg-gray-50 border rounded p-4 whitespace-pre-wrap">
            {seleccionada.rubrosInteres}
          </div>
        )}

        {seccionActiva === 'ubicaciones' && (
          <div className="space-y-4">
            {seleccionada.ubicaciones?.map((u, i) => (
              <div key={i} className="p-4 bg-gray-50 border rounded shadow-sm">
                <p><strong>Dirección:</strong> {mostrarCampo(u.direccion)}</p>
                <p><strong>Estado / Municipio:</strong> {mostrarCampo(u.estado)} / {mostrarCampo(u.municipio)}</p>
                <p><strong>Código Postal:</strong> {mostrarCampo(u.cp)}</p>
                <p><strong>Suma Asegurada:</strong> {mostrarCampo(u.suma)} {mostrarCampo(u.tipoMoneda)}</p>
                <p><strong>GPS:</strong> {(u.latitud && u.longitud) ? `${u.latitud}, ${u.longitud}` : 'Sin coordenadas'}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-50">
      <aside className="w-1/5 border-r p-5 bg-white shadow-md">
        <h3 className="text-gray-700 font-bold mb-3 text-lg">Años</h3>
        {Object.keys(agrupadasFiltradas).map((año) => (
          <button
            key={año}
            onClick={() => {
              setAñoSeleccionado(añoSeleccionado === año ? null : año);
              setMesSeleccionado(null);
            }}
            className={`w-full px-4 py-2 mb-2 rounded transition duration-200 font-semibold text-sm ${
              añoSeleccionado === año
                ? 'bg-red-600 text-white'
                : 'bg-white text-red-600 border border-red-500 hover:bg-red-50'
            }`}
          >
            {año}
          </button>
        ))}

        {añoSeleccionado && (
          <>
            <h4 className="text-gray-700 font-bold mt-6 mb-2 text-sm">Meses</h4>
            {mesesDisponibles.map((mes) => (
              <button
                key={mes}
                onClick={() => setMesSeleccionado(mes)}
                className={`w-full px-4 py-2 mb-2 rounded transition duration-200 text-sm ${
                  mesSeleccionado === mes
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-red-700 border border-red-400 hover:bg-red-50'
                }`}
              >
                {mes}
              </button>
            ))}
          </>
        )}
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Solicitudes de Inspección</h2>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 font-medium mb-1">Filtrar por razón social:</label>
          <input
            type="text"
            placeholder="Ej. CAST SA DE CV"
            className="w-full px-4 py-2 border border-red-500 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-red-400 text-gray-700"
            value={razonFiltro}
            onChange={(e) => {
              const valor = e.target.value;
              setRazonFiltro(valor);

              const match = solicitudes.find((s) =>
                s.razonSocial.toLowerCase().includes(valor.toLowerCase())
              );

              if (match) {
                const fecha = new Date(match.fechaSolicitud);
                const año = fecha.getFullYear();
                const mes = fecha.toLocaleString('es-MX', { month: 'long' });
                setAñoSeleccionado(año.toString());
                setMesSeleccionado(mes);
              } else {
                setAñoSeleccionado(null);
                setMesSeleccionado(null);
              }
            }}

            list="razones"
          />
          <datalist id="razones">
            {razonesUnicas.map((r, i) => (
              <option key={i} value={r} />
            ))}
          </datalist>
        </div>

        {añoSeleccionado && mesSeleccionado ? (
          <div className="space-y-3">
            {solicitudesMostrar.length > 0 ? (
              solicitudesMostrar.map((s, i) => (
                <div
                  key={i}
                  className="px-5 py-3 bg-white border border-red-400 rounded-lg shadow hover:shadow-md transition text-red-700 font-medium cursor-pointer"
                  onClick={() => {
                    setSeleccionada(s);
                    console.log("🔍 Datos de solicitud seleccionada:", s);
                    setSeccionActiva('generales');
                  }}
                >
                  {s.razonSocial}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No hay solicitudes registradas.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">Selecciona un año y mes para ver las solicitudes.</p>
        )}
      </main>
    </div>
  );
}


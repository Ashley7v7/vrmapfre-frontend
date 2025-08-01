// Código actualizado de SolicitudVisita.jsx

import React, { useState, useEffect } from 'react';
import { estadosConMunicipios } from '../data/estados_municipios_completo';
import MapaUbicacion from '../components/MapaUbicacion';
import { guardarSolicitudEnVisitasProgramadas } from '../utils/guardarSolicitud';
const API_URL = import.meta.env.VITE_API_URL;

export default function SolicitudVisita() {
  const [seccionActiva, setSeccionActiva] = useState('generales');
  const [ubicaciones, setUbicaciones] = useState([
    {
      id: 1,
      direccion: '',
      estado: '',
      municipio: '',
      gps: { lat: null, lng: null },
      suma: '',
      tipoMoneda: 'MXN',
      cp: ''
    }
  ]);

  const eliminarUbicacion = (index) => {
    const nuevas = [...ubicaciones];
    nuevas.splice(index, 1);
    setUbicaciones(nuevas);
  };

  const nombreSuscriptor = localStorage.getItem('nombreCompleto') || '';

  const secciones = [
    { id: 'generales', label: 'Datos generales' },
    { id: 'contacto', label: 'Datos de contacto' },
    { id: 'interes', label: 'Rubros de interés' },
    { id: 'usoReporte', label: 'Uso del reporte de Inspección' }, 
    { id: 'ubicaciones', label: 'Ubicaciones a inspeccionar' }
  ];

  const [datosFormulario, setDatosFormulario] = useState({
    razonSocial: '', monto: '', giro: '', tipoNegocio: '', poliza: '',
    vigenciaInicio: '', vigenciaTermino: '', coordinador: '', territorial: '', representante: '',
    suscriptor: '', moneda: 'MXN', telSuscriptor: '', correoSuscriptor: '', tipoVisita: '',
    correoCoordinador: '', telCoordinador: '', correoRepresentante: '', telRepresentante: '', endoso: '', territorialOtra: '',  usoReporte: '', 
    compartirCon: {
      agente: false,
      asegurado: false,
      coaseguro: false,
      reaseguro: false,
      otros: false,
      otrosTexto: ''
    }
  });

  useEffect(() => {
    const nombreGuardado = localStorage.getItem('nombreCompleto') || '';
    const correoGuardado = localStorage.getItem('correo') || '';

    setDatosFormulario(prev => ({
      ...prev,
      suscriptor: nombreGuardado,
      correoSuscriptor: correoGuardado
    }));
  }, []);

  const [datosContacto, setDatosContacto] = useState({
    nombreAsegurado: '', puestoAsegurado: '', telAsegurado: '', correoAsegurado: '',
    nombreAgente: '', puestoAgente: '', telAgente: '', correoAgente: ''
  });

  const [rubrosInteres, setRubrosInteres] = useState('');

  const [usoReporte, setUsoReporte] = useState(''); // interno o externo
  const [compartirCon, setCompartirCon] = useState({
    agente: false,
    asegurado: false,
    coaseguro: false,
    reaseguro: false,
    otros: false,
    otrosTexto: ''
  });


  const agregarUbicacion = () => {
    setUbicaciones([
      ...ubicaciones,
      {
        id: ubicaciones.length + 1,
        direccion: '',
        estado: '',
        municipio: '',
        gps: { lat: null, lng: null },
        suma: '',
        tipoMoneda: 'MXN',
        cp: ''
      }
    ]);
  };




  const handleEnviar = async () => {
    const nombreAsegurado = datosContacto.nombreAsegurado.trim();
    const telAsegurado = datosContacto.telAsegurado.trim();
    const correoAsegurado = datosContacto.correoAsegurado.trim();
    const nombreAgente = datosContacto.nombreAgente.trim();
    const telAgente = datosContacto.telAgente.trim();
    const correoAgente = datosContacto.correoAgente.trim();

    const aseguradoValido = nombreAsegurado && (telAsegurado || correoAsegurado);
    const agenteValido = nombreAgente && (telAgente || correoAgente);

    if (!aseguradoValido && !agenteValido) {
      alert('Debes llenar al menos los datos del Asegurado o del Agente/Broker. Cada uno requiere el nombre completo y teléfono o correo.');
      return;
    }

    if (
      !datosFormulario.razonSocial ||
      !datosFormulario.monto ||
      !datosFormulario.giro ||
      ubicaciones.length === 0 ||
      ubicaciones.some(u => !u.direccion || !u.estado || !u.municipio)
    ) {
      alert('Por favor completa todos los campos obligatorios antes de enviar la solicitud.');
      return;
    }

    const ubicacionesConCoords = ubicaciones.map((u) => ({
      direccion: u.direccion,
      estado: u.estado,
      municipio: u.municipio,
      cp: u.cp || '',
      suma: u.suma || '',
      tipoMoneda: u.tipoMoneda || 'MXN',
      gps: u.gps || { lat: null, lng: null },
      latitud: u.gps?.lat || null,
      longitud: u.gps?.lng || null
    }));

    console.log("📝 datosFormulario:", datosFormulario);
    console.log("📍 ubicaciones:", ubicaciones);
    console.log("📞 contacto:", datosContacto);
    console.log("📌 rubros:", rubrosInteres);

    if (!datosFormulario.tipoVisita || !datosFormulario.tipoNegocio || !datosFormulario.vigenciaInicio || !datosFormulario.vigenciaTermino) {
      alert('Por favor completa los campos de tipo de visita, negocio y vigencia');
      return;
    }


    await guardarSolicitudEnVisitasProgramadas(datosFormulario, ubicaciones, datosContacto, rubrosInteres);




    alert('Solicitud enviada correctamente. Consulta el estatus en Visitas Programadas.');

    setDatosFormulario(prev => ({
      ...prev,
      razonSocial: '', monto: '', giro: '', tipoNegocio: '', poliza: '',
      vigenciaInicio: '', vigenciaTermino: '', coordinador: '', correoCoordinador: '', telCoordinador: '',
      territorial: '', representante: '', correoRepresentante: '', telRepresentante: '',
      suscriptor: localStorage.getItem('nombreCompleto') || '',
      correoSuscriptor: localStorage.getItem('correo') || '',
      moneda: 'MXN', telSuscriptor: '', endoso: '', territorialOtra: ''
    }));

    setDatosContacto({
      nombreAsegurado: '', puestoAsegurado: '', telAsegurado: '', correoAsegurado: '',
      nombreAgente: '', puestoAgente: '', telAgente: '', correoAgente: ''
    });

    setRubrosInteres('');
    setUbicaciones([{ id: 1, direccion: '', estado: '', municipio: '', gps: { lat: null, lng: null }, suma: '', tipoMoneda: 'MXN', cp: '' }]);
  };
  //--------------------------------------------------------------------
  // TablaVisitas.jsx (sin cambios necesarios, ya está bien)
  // Asegúrate solo de que las columnas "estado" y "municipio" existan en cada objeto de visita
  // y que en SolicitudVisita se estén guardando correctamente.


  return (
    <div>
      <div className="mb-4 text-right">
        <button
          onClick={handleEnviar}
          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded shadow"
        >
          Enviar Solicitud
        </button>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Solicitud de Visita de Inspección</h2>

      <div className="flex space-x-2 mb-6">
        {secciones.map((sec) => (
          <button
            key={sec.id}
            className={`px-4 py-2 rounded ${seccionActiva === sec.id ? 'bg-gray-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setSeccionActiva(sec.id)}
          >
            {sec.label}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Tipo de Visita:</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={datosFormulario.tipoVisita}
          onChange={(e) =>
            setDatosFormulario({ ...datosFormulario, tipoVisita: e.target.value })
          }
        >
          <option value="">Selecciona una opción</option>
          <option value="Termografia">Termografia</option>
          <option value="Daños">Daños</option>
          <option value="Transporte">Transporte</option>
        </select>

      </div>



      {seccionActiva === 'generales' && (
        <form className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos Generales</h3>

          <div>
            <label className="block text-gray-700">Razón Social del Asegurado:</label>
            <input
              type="text"
              name="razonSocial"
              value={datosFormulario.razonSocial}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, razonSocial: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>


          <div>
            <label className="block text-gray-700 mb-1">Monto de Prima:</label>
            <div className="relative">
              {/* Símbolo a la izquierda */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                {datosFormulario.moneda === 'USD' ? '$' :
                datosFormulario.moneda === 'EUR' ? '€' :
                datosFormulario.moneda === 'MXN' ? '$' : ''}
              </span>

              {/* Input */}
              <input
                type="number"
                name="monto"
                value={datosFormulario.monto}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, monto: e.target.value })}
                className="w-full border border-gray-300 rounded px-8 py-2 pr-20 text-sm text-gray-700 focus:border-gray-400 focus:ring-0 outline-none"
                placeholder="Ej. 15000"
              />

              {/* Selector a la derecha */}
              <select
                name="moneda"
                value={datosFormulario.moneda}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, moneda: e.target.value })}
                className="absolute right-0 top-0 h-full bg-transparent border-none pr-3 pl-2 text-sm text-gray-700 focus:outline-none"
              >
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>




          <div>
            <label className="block text-gray-700">Giro Declarado:</label>
            <input
              type="text"
              name="giro"
              value={datosFormulario.giro}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, giro: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700">Tipo de Negocio:</label>
            <select
              name="tipoNegocio"
              value={datosFormulario.tipoNegocio}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, tipoNegocio: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Selecciona una opción</option>
              <option value="Nuevo">Nuevo</option>
              <option value="Renovación">Renovación</option>
            </select>

          </div>

            <div>
              <label className="block text-gray-700">Número de Póliza:</label>
              <input
                type="text"
                name="poliza"
                value={datosFormulario.poliza}
                onChange={(e) => {
                  const soloNumeros = e.target.value.replace(/\D/g, ''); // elimina letras y símbolos
                  if (soloNumeros.length <= 13) {
                    setDatosFormulario({ ...datosFormulario, poliza: soloNumeros });
                  }
                }}
                inputMode="numeric"
                maxLength={13}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Ingrese solo números (máx 13)"
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700">Endoso:</label>
              <input
                type="text"
                name="endoso"
                value={datosFormulario.endoso}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, endoso: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Endoso (si aplica)"
              />
            </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Vigencia (Inicio):</label>
              <input
                type="date"
                name="vigenciaInicio"
                value={datosFormulario.vigenciaInicio}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, vigenciaInicio: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-gray-700">Vigencia (Término):</label>
              <input
                type="date"
                name="vigenciaTermino"
                value={datosFormulario.vigenciaTermino}
                onChange={(e) => setDatosFormulario({ ...datosFormulario, vigenciaTermino: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700">Suscriptor(a) que solicita:</label>
            <input
              type="text"
              name="suscriptor"
              value={datosFormulario.suscriptor}
              onChange={(e) =>
                setDatosFormulario({ ...datosFormulario, suscriptor: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="Nombre del suscriptor(a)"
            />
          </div>

          <div>
            <label className="block text-gray-700">Teléfono del suscriptor(a):</label>
            <input
              type="tel"
              name="telSuscriptor"
              value={datosFormulario.telSuscriptor}
              onChange={(e) =>
                setDatosFormulario({ ...datosFormulario, telSuscriptor: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Ej. 5523456789"
            />
          </div>

          <div>
            <label className="block text-gray-700">Correo del suscriptor(a):</label>
            <input
              type="email"
              name="correoSuscriptor"
              value={datosFormulario.correoSuscriptor}
              onChange={(e) =>
                setDatosFormulario({ ...datosFormulario, correoSuscriptor: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="Ej. suscriptor@mapfre.com"
            />
          </div>


          <div>
            <label className="block text-gray-700">Coordinador(a) de Suscripción que autoriza:</label>
            <input
              type="text"
              name="coordinador"
              value={datosFormulario.coordinador}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, coordinador: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-gray-700">Correo del Coordinador(a):</label>
            <input
              type="email"
              name="correoCoordinador"
              value={datosFormulario.correoCoordinador}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, correoCoordinador: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="coordinador@mapfre.com"
            />
          </div>

          <div>
            <label className="block text-gray-700">Teléfono del Coordinador(a):</label>
            <input
              type="tel"
              name="telCoordinador"
              value={datosFormulario.telCoordinador}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, telCoordinador: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="Ej. 55 1234 5678"
            />
          </div>


          <div>
            <label className="block text-gray-700">Territorial:</label>
            <select
              name="territorial"
              value={datosFormulario.territorial}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, territorial: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Selecciona una opción</option>
              <option value="Metropolitanas">Metropolitanas</option>
              <option value="Norte">Norte</option>
              <option value="Sur">Sur</option>
              <option value="Centro">Centro</option>
              <option value="Occidente">Occidente</option>payload
              <option value="Corredores">Corredores</option>
              <option value="Otra">Otras (especifique)</option>
            </select>
          </div>

          {/* Campo condicional si selecciona "Otra" */}
          {datosFormulario.territorial === 'Otra' && (
            <div className="mt-2">
              <label className="block text-gray-700">Especifique la Territorial:</label>
              <input
                type="text"
                name="territorialOtra"
                value={datosFormulario.territorialOtra || ''}
                onChange={(e) =>
                  setDatosFormulario({ ...datosFormulario, territorialOtra: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700">Representante de Área Comercial:</label>
            <input
              type="text"
              name="representante"
              value={datosFormulario.representante}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, representante: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-gray-700">Correo del Representante:</label>
            <input
              type="email"
              name="correoRepresentante"
              value={datosFormulario.correoRepresentante}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, correoRepresentante: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="representante@mapfre.com"
            />
          </div>

          <div>
            <label className="block text-gray-700">Teléfono del Representante:</label>
            <input
              type="tel"
              name="telRepresentante"
              value={datosFormulario.telRepresentante}
              onChange={(e) => setDatosFormulario({ ...datosFormulario, telRepresentante: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-700"
              placeholder="Ej. 55 1234 5678"
            />
          </div>




        </form>
      )}


      {seccionActiva === 'contacto' && (
        <form className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos de contacto para la gestión de la visita</h3>

          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-1">Asegurado</h4>
            <input type="text" placeholder="Nombre completo" value={datosContacto.nombreAsegurado} onChange={(e) => setDatosContacto({ ...datosContacto, nombreAsegurado: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Puesto" value={datosContacto.puestoAsegurado} onChange={(e) => setDatosContacto({ ...datosContacto, puestoAsegurado: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="tel" placeholder="Número telefónico" value={datosContacto.telAsegurado} onChange={(e) => setDatosContacto({ ...datosContacto, telAsegurado: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="email" placeholder="Correo electrónico" value={datosContacto.correoAsegurado} onChange={(e) => setDatosContacto({ ...datosContacto, correoAsegurado: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-1">Agente o Broker</h4>
            <input type="text" placeholder="Nombre completo" value={datosContacto.nombreAgente} onChange={(e) => setDatosContacto({ ...datosContacto, nombreAgente: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="text" placeholder="Puesto" value={datosContacto.puestoAgente} onChange={(e) => setDatosContacto({ ...datosContacto, puestoAgente: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="tel" placeholder="Número telefónico" value={datosContacto.telAgente} onChange={(e) => setDatosContacto({ ...datosContacto, telAgente: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
            <input type="email" placeholder="Correo electrónico" value={datosContacto.correoAgente} onChange={(e) => setDatosContacto({ ...datosContacto, correoAgente: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </form>
      )}

      {seccionActiva === 'interes' && (
        <form className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Rubros de principal interés</h3>
          <p className="text-sm text-gray-600 mb-1">Describe brevemente qué tipo de información deseas obtener durante la visita de inspección:</p>
          <textarea
            placeholder="Ejemplo: Evaluación de condiciones de seguridad, puntos críticos en el proceso, etc."
            value={rubrosInteres}
            onChange={(e) => setRubrosInteres(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-40"
          ></textarea>
        </form>
      )}

      
      {seccionActiva === 'uso' && (
        <div className="bg-gray-50 border rounded p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Uso del Reporte:</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={formulario.usoReporte}
              onChange={(e) =>
                setFormulario({ ...formulario, usoReporte: e.target.value })
              }
            >
              <option value="">Selecciona una opción</option>
              <option value="Interno">Uso Interno</option>
              <option value="Externo">Uso Externo</option>
            </select>
          </div>

          {formulario.usoReporte === 'Externo' && (
            <div className="space-y-3 border-t pt-4">
              <label className="block text-gray-700 font-semibold">¿Con quién se compartirá?</label>

              <div className="space-y-2">
                <label className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formulario.compartirCon.agente}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        compartirCon: { ...formulario.compartirCon, agente: e.target.checked },
                      })
                    }
                  />
                  Agente / Broker
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formulario.compartirCon.asegurado}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        compartirCon: { ...formulario.compartirCon, asegurado: e.target.checked },
                      })
                    }
                  />
                  Asegurado
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formulario.compartirCon.coaseguro}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        compartirCon: { ...formulario.compartirCon, coaseguro: e.target.checked },
                      })
                    }
                  />
                  Coaseguro
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formulario.compartirCon.reaseguro}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        compartirCon: { ...formulario.compartirCon, reaseguro: e.target.checked },
                      })
                    }
                  />
                  Reaseguro
                </label>
                <label className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formulario.compartirCon.otros}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        compartirCon: { ...formulario.compartirCon, otros: e.target.checked },
                      })
                    }
                  />
                  Otros
                </label>
                {formulario.compartirCon.otros && (
                  <input
                    type="text"
                    placeholder="Especifique..."
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded"
                    value={formulario.compartirCon.otrosTexto}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        compartirCon: {
                          ...formulario.compartirCon,
                          otrosTexto: e.target.value,
                        },
                      })
                    }
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}




      {seccionActiva === 'usoReporte' && (
        <div className="bg-gray-50 border rounded p-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Uso del reporte de Inspección</h3>

          {/* Select: Interno o Externo */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">Selecciona el uso del reporte:</label>
            <select
              value={datosFormulario.usoReporte}
              onChange={(e) =>
                setDatosFormulario({ ...datosFormulario, usoReporte: e.target.value })
              }
              className="w-full border border-gray-400 rounded px-4 py-2 text-gray-800"
            >
              <option value="">Selecciona una opción</option>
              <option value="Interno">Uso Interno</option>
              <option value="Externo">Uso Externo</option>
            </select>
          </div>

          {/* Checkboxes si es Externo */}
          {datosFormulario.usoReporte === 'Externo' && (
            <div className="space-y-2 border-t pt-4">
              <p className="font-semibold text-gray-700">¿Con quién se compartirá el reporte?</p>

              {[
                { id: 'agente', label: 'Agente / Broker' },
                { id: 'asegurado', label: 'Asegurado' },
                { id: 'coaseguro', label: 'Coaseguro' },
                { id: 'reaseguro', label: 'Reaseguro' },
                { id: 'otros', label: 'Otros (especifique)' }
              ].map((op) => (
                <label key={op.id} className="flex items-center space-x-2 text-gray-700">
                  <input
                    type="checkbox"
                    checked={datosFormulario.compartirCon[op.id]}
                    onChange={(e) =>
                      setDatosFormulario({
                        ...datosFormulario,
                        compartirCon: {
                          ...datosFormulario.compartirCon,
                          [op.id]: e.target.checked
                        }
                      })
                    }
                    className="accent-gray-700"
                  />
                  <span>{op.label}</span>
                </label>
              ))}

              {/* Campo de texto si "otros" está seleccionado */}
              {datosFormulario.compartirCon.otros && (
                <div className="mt-2">
                  <label className="block text-sm text-gray-600">Especificar:</label>
                  <input
                    type="text"
                    value={datosFormulario.compartirCon.otrosTexto}
                    onChange={(e) =>
                      setDatosFormulario({
                        ...datosFormulario,
                        compartirCon: {
                          ...datosFormulario.compartirCon,
                          otrosTexto: e.target.value
                        }
                      })
                    }
                    className="w-full border border-gray-400 rounded px-3 py-2 text-gray-800"
                    placeholder="Especificar con quién más se compartirá"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}








      {seccionActiva === 'ubicaciones' && (
        <form className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Ubicaciones a inspeccionar</h3>
          <p className="text-sm text-gray-600 mb-4">
            Agrega las direcciones según el número de ubicaciones a inspeccionar.
          </p>

          {ubicaciones.map((ubic, index) => (
            <div key={ubic.id} className="border border-gray-300 rounded p-4 space-y-4 bg-white shadow">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-700">Ubicación {index + 1}</h4>
                  {ubicaciones.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarUbicacion(index)}
                      className="text-red-500 hover:text-red-700 text-lg font-bold"
                      title="Eliminar esta ubicación"
                    >
                      ×
                    </button>

                  )}
                </div>


              {/* Estado */}
              <div>
                <label className="block text-gray-700">Estado:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={ubic.estado}
                  onChange={(e) => {
                    const nuevas = [...ubicaciones];
                    nuevas[index].estado = e.target.value;
                    nuevas[index].municipio = '';
                    setUbicaciones(nuevas);
                  }}
                >
                  <option value="">Selecciona un estado</option>
                  {Object.keys(estadosConMunicipios).map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              {/* Municipio */}
              <div>
                <label className="block text-gray-700">Municipio:</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  value={ubic.municipio}
                  onChange={(e) => {
                    const nuevas = [...ubicaciones];
                    nuevas[index].municipio = e.target.value;
                    setUbicaciones(nuevas);
                  }}
                  disabled={!ubic.estado}
                >
                  <option value="">Selecciona un municipio</option>
                  {ubic.estado &&
                    estadosConMunicipios[ubic.estado]?.map((municipio) => (
                      <option key={municipio} value={municipio}>
                        {municipio}
                      </option>
                    ))}
                </select>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-gray-700">Dirección (calle, número, colonia):</label>
                <textarea
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Ej. Calle 5, #123, Col. Industrial"
                  value={ubic.direccion}
                  onChange={(e) => {
                    const nuevas = [...ubicaciones];
                    nuevas[index].direccion = e.target.value;
                    setUbicaciones(nuevas);
                  }}
                ></textarea>
              </div>

              {/* Código Postal */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Código Postal:</label>
                <input
                  type="text"
                  name="cp"
                  value={ubic.cp || ''}
                  onChange={(e) => {
                    const nuevas = [...ubicaciones];
                    nuevas[index].cp = e.target.value;
                    setUbicaciones(nuevas);
                  }}
                  placeholder="Ej. 52900"
                  className="block w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* 🌍 Mapa */}
              <MapaUbicacion
                coordenadas={ubic.gps}
                setCoordenadas={(coord) => {
                  const nuevas = [...ubicaciones];
                  nuevas[index].gps = coord;
                  setUbicaciones(nuevas);
                }}
              />

              {/* Suma asegurada */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Suma Asegurada:</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                    {ubic.tipoMoneda === 'EUR' ? '€' : '$'}
                  </span>

                  </div>
                  <input
                    type="number"
                    name="sumaAsegurada"
                    value={ubic.suma || ''}
                    onChange={(e) => {
                      const nuevas = [...ubicaciones];
                      nuevas[index].suma = e.target.value;
                      setUbicaciones(nuevas);
                    }}
                    placeholder="Ej. 500000"
                    className="block w-full pl-10 pr-20 border border-gray-300 rounded-md py-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <select
                      value={ubic.tipoMoneda || 'MXN'}
                      onChange={(e) => {
                        const nuevas = [...ubicaciones];
                        nuevas[index].tipoMoneda = e.target.value;
                        setUbicaciones(nuevas);
                      }}
                      className="text-gray-700 bg-transparent border-none focus:ring-0 sm:text-sm"
                    >
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>
          ))}

          <button
            type="button"
            onClick={agregarUbicacion}
            className="bg-gray-700 text-white px-4 py-2 rounded shadow hover:bg-gray-800"
          >
            + Agregar otra ubicación
          </button>
        </form>
      )}


    </div>
  );
}

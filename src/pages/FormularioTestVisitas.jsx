import React, { useState } from 'react';
import { estadosConMunicipios } from '../data/estados_municipios_completo';

export default function FormularioTestVisitas() {
  const [razonSocial, setRazonSocial] = useState('');
  const [monto, setMonto] = useState('');
  const [giro, setGiro] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('');
  const [municipio, setMunicipio] = useState('');

  const handleGuardar = () => {
    if (!razonSocial || !monto || !giro || !direccion || !municipio || !estado) {
      alert('Llena todos los campos');
      return;
    }

    const visita = {
      id: Date.now(),
      estatus: 'En espera',
      fechaSolicitud: new Date().toISOString().split('T')[0],
      asegurado: razonSocial,
      direccion,
      municipio,
      estado,
      cobertura: monto,
      giro,
      fechaVisita: '',
      suscriptor: localStorage.getItem('nombreCompleto') || 'Desconocido',
      ingeniero: ''
    };

    const visitasGuardadas = JSON.parse(localStorage.getItem('visitas')) || [];
    const nuevas = [...visitasGuardadas, visita];
    localStorage.setItem('visitas', JSON.stringify(nuevas));

    alert('✅ Visita guardada');
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Formulario Rápido de Prueba</h2>
      <input placeholder="Razón Social" value={razonSocial} onChange={(e) => setRazonSocial(e.target.value)} className="w-full border p-2" />
      <input placeholder="Monto" value={monto} onChange={(e) => setMonto(e.target.value)} className="w-full border p-2" />
      <input placeholder="Giro" value={giro} onChange={(e) => setGiro(e.target.value)} className="w-full border p-2" />
      <input placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="w-full border p-2" />

      <select value={estado} onChange={(e) => {
        setEstado(e.target.value);
        setMunicipio(''); // reiniciar municipio si cambia estado
      }} className="w-full border p-2">
        <option value="">Selecciona Estado</option>
        {Object.keys(estadosConMunicipios).map(est => (
          <option key={est} value={est}>{est}</option>
        ))}
      </select>

      <select value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="w-full border p-2" disabled={!estado}>
        <option value="">Selecciona Municipio</option>
        {(estadosConMunicipios[estado] || []).map(mun => (
          <option key={mun} value={mun}>{mun}</option>
        ))}
      </select>

      <button onClick={handleGuardar} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Visita</button>
    </div>
  );
}

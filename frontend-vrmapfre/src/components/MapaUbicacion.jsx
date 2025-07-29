import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🔧 Esta configuración hace que Leaflet use los íconos desde /public
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// 📍 Componente que detecta clics en el mapa
function LocationPicker({ setCoords }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setCoords({ lat, lng });
    },
  });
  return null;
}

// 🔁 Centra el mapa cuando se actualizan coords
function MapMover({ coords }) {
  const map = useMap();
  if (coords.lat && coords.lng) {
    map.setView([coords.lat, coords.lng], 16);
  }
  return null;
}

export default function MapaUbicacion({ coordenadas, setCoordenadas }) {
  const [direccion, setDireccion] = useState('');

  const buscarDireccion = async () => {
    if (!direccion) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`
      );
      const data = await response.json();

      if (data?.length > 0) {
        const { lat, lon } = data[0];
        setCoordenadas({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert('No se encontró la dirección.');
      }
    } catch (error) {
      console.error('Error al buscar dirección:', error);
      alert('Error al buscar la dirección.');
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Buscar por dirección:</label>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          placeholder="Ej. Calle 5, Ciudad, Estado"
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={buscarDireccion}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Buscar
        </button>
      </div>

      <MapContainer
        center={[19.4326, -99.1332]}
        zoom={6}
        style={{ height: '300px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationPicker setCoords={setCoordenadas} />
        <MapMover coords={coordenadas} />
        {coordenadas.lat && (
          <Marker position={[coordenadas.lat, coordenadas.lng]} />
        )}
      </MapContainer>

      {coordenadas.lat && (
        <p className="mt-2 text-sm text-gray-700">
          Coordenadas seleccionadas: {coordenadas.lat}, {coordenadas.lng}
        </p>
      )}
    </div>
  );
}

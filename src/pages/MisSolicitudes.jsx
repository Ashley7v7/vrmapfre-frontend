import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function MisSolicitudes() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const correo = localStorage.getItem("correo"); // 📌 El correo del login

  useEffect(() => {
    if (correo) {
      axios
        .get(`${API_URL}/api/mis-solicitudes/${correo}`)
        .then((res) => {
          // 📌 Asegurar que siempre guardamos un array
          setSolicitudes(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => {
          console.error("Error al cargar mis solicitudes:", err);
          setSolicitudes([]); // En caso de error, dejamos array vacío
        })
        .finally(() => setCargando(false));
    } else {
      setCargando(false);
    }
  }, [correo]);

  const editarSolicitud = (solicitud) => {
    localStorage.setItem("solicitudEditar", JSON.stringify(solicitud));
    window.location.href = "/editar-solicitud"; // Cambia por tu ruta real
  };

  if (cargando) return <p className="text-center mt-10">Cargando solicitudes...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-red-700 mb-4">📋 Mis Solicitudes</h2>
      {solicitudes.length === 0 ? (
        <p className="text-gray-500">No has enviado solicitudes todavía.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Asegurado</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Estatus</th>
              <th className="border p-2">Fecha Solicitud</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(solicitudes) &&
              solicitudes.map((sol) => (
                <tr key={sol.id}>
                  <td className="border p-2">{sol.id}</td>
                  <td className="border p-2">{sol.asegurado}</td>
                  <td className="border p-2">{sol.estado}</td>
                  <td className="border p-2">{sol.estatus}</td>
                  <td className="border p-2">
                    {new Date(sol.fechaSolicitud).toLocaleDateString()}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => editarSolicitud(sol)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      ✏ Editar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// src/components/RiesgosCAT.jsx
import React from 'react';

export default function RiesgosCAT({ catRiesgos, handleNivelChange, calcularCalificacion }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Riesgo</th>
            <th className="px-4 py-2">Nivel</th>
          </tr>
        </thead>
        <tbody>
          {catRiesgos.map((r, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{r.riesgo}</td>
              <td className="px-4 py-2">
                <select
                  value={r.nivel}
                  onChange={(e) => handleNivelChange(idx, e.target.value)}
                  className={`border p-2 rounded w-full
                    ${r.nivel === 'Muy Bajo' ? 'bg-green-200' : ''}
                    ${r.nivel === 'Bajo' ? 'bg-lime-200' : ''}
                    ${r.nivel === 'Medio' ? 'bg-yellow-200' : ''}
                    ${r.nivel === 'Alto' ? 'bg-orange-200' : ''}
                    ${r.nivel === 'Muy Alto' ? 'bg-red-300' : ''}`}
                >
                  <option value="">Seleccione</option>
                  <option>Muy Bajo</option>
                  <option>Bajo</option>
                  <option>Medio</option>
                  <option>Alto</option>
                  <option>Muy Alto</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-xl text-gray-700 font-bold">
        Calificación General: {calcularCalificacion()}
      </div>
    </div>
  );
}

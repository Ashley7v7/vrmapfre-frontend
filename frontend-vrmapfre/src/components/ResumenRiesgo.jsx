// src/components/ResumenRiesgo.jsx
import React from 'react';

export default function ResumenRiesgo({ formValues, handleInputChange, handleAreaChange }) {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        name="actividadDeclarada"
        placeholder="Actividad Declarada"
        value={formValues.actividadDeclarada}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Actividad Evaluada</label>
        <select
          name="actividadEvaluada"
          value={formValues.actividadEvaluada}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Idéntica">Idéntica</option>
          <option value="Diferente">Diferente</option>
        </select>
        {formValues.actividadEvaluada === "Diferente" && (
          <input
            name="actividadDiferente"
            placeholder="¿Cuál?"
            value={formValues.actividadDiferente}
            onChange={handleInputChange}
            className="border p-2 rounded mt-2"
          />
        )}
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Tipo de Visita</label>
        <select
          name="tipoVisita"
          value={formValues.tipoVisita}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Presencial">Presencial</option>
          <option value="Virtual">Virtual</option>
        </select>
      </div>

      <input
        type="number"
        name="numeroAreas"
        placeholder="Nº Áreas de fuego"
        value={formValues.numeroAreas}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      {/* Descripción de Áreas */}
      {Array.from({ length: Number(formValues.numeroAreas) || 0 }).map((_, idx) => (
        <input
          key={idx}
          placeholder={`Área ${idx + 1}`}
          value={formValues.areasDescripcion[idx] || ''}
          onChange={(e) => handleAreaChange(idx, e.target.value)}
          className="border p-2 rounded col-span-2"
        />
      ))}

      <textarea
        name="descripcionRiesgo"
        placeholder="Descripción general del riesgo"
        value={formValues.descripcionRiesgo}
        onChange={handleInputChange}
        className="border p-2 rounded col-span-2"
        rows="3"
      />

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">¿Cuenta con dictamen estructural?</label>
        <select
          name="tieneDictamen"
          value={formValues.tieneDictamen}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">¿Daños considerables?</label>
        <select
          name="daños"
          value={formValues.daños}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">¿Evidencia de deterioro?</label>
        <select
          name="deterioro"
          value={formValues.deterioro}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="flex flex-col col-span-2">
        <label className="text-sm text-gray-600 mb-1">Siniestralidad en los últimos 5 años</label>
        <select
          name="siniestralidad"
          value={formValues.siniestralidad}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Con registro">Con registro</option>
          <option value="Sin registro">Sin registro</option>
        </select>
      </div>

      {formValues.siniestralidad === "Con registro" && (
        <input
          name="detalleSiniestralidad"
          placeholder="Detalle de siniestros"
          value={formValues.detalleSiniestralidad}
          onChange={handleInputChange}
          className="border p-2 rounded col-span-2"
        />
      )}
    </form>
  );
}

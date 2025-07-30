// src/components/InfoGeneral.jsx
import React from 'react';

export default function InfoGeneral({ formValues, handleInputChange }) {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        name="razonSocial"
        placeholder="Razón Social"
        value={formValues.razonSocial}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <input
        name="direccion"
        placeholder="Dirección"
        value={formValues.direccion}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Fecha de la Visita</label>
        <input
          type="date"
          name="fechaVisita"
          value={formValues.fechaVisita}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
      </div>

      <input
        name="suscriptor"
        placeholder="Suscriptor"
        value={formValues.suscriptor}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <input
        name="ingeniero"
        placeholder="Ingeniero"
        value={formValues.ingeniero}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <input
        name="sumaAsegurada"
        placeholder="Suma Asegurada"
        value={formValues.sumaAsegurada}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Fecha Antecedente MAPFRE</label>
        <input
          type="date"
          name="antecedenteFecha"
          value={formValues.antecedenteFecha}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Territorial</label>
        <select
          name="territorial"
          value={formValues.territorial}
          onChange={handleInputChange}
          className="border p-2 rounded"
        >
          <option value="">Seleccione</option>
          <option value="Centro">Centro</option>
          <option value="Occidente">Occidente</option>
          <option value="Norte">Norte</option>
          <option value="Bancaseguros">Bancaseguros</option>
          <option value="Sencillo">Sencillo</option>
          <option value="Metropolitanas">Metropolitanas</option>
          <option value="Corredores">Corredores</option>
          <option value="Sur">Sur</option>
          <option value="Foráneas">Foráneas</option>
        </select>
      </div>

      <input
        name="poliza"
        placeholder="No. Póliza"
        value={formValues.poliza}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
    </form>
  );
}

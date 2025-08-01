export async function guardarSolicitudEnVisitasProgramadas(solicitudForm, ubicaciones, contacto, rubrosInteres) {
  try {
    const fechaHoy = new Date().toISOString();
    const suscriptor = localStorage.getItem('nombreCompleto') || 'Sin nombre';

    const visitas = ubicaciones.map((ubic) => ({
      suscriptor,
      asegurado: solicitudForm.razonSocial || 'No especificado',
      direccion: ubic.direccion || '',
      ciudad: ubic.municipio || '',
      municipio: ubic.municipio || '',
      estado: ubic.estado || '',
      cobertura: solicitudForm.monto || '',
      giro: solicitudForm.giro || '',
      fechaSolicitud: fechaHoy,
      estatus: 'En espera',
      latitud: ubic.gps?.lat || null,
      longitud: ubic.gps?.lng || null,
      tipoMoneda: ubic.tipoMoneda || 'MXN',
      cp: ubic.cp || '',
      ingeniero: '',




      vigenciaInicio: solicitudForm.vigenciaInicio ? new Date(solicitudForm.vigenciaInicio).toISOString() : null,
      vigenciaTermino: solicitudForm.vigenciaTermino ? new Date(solicitudForm.vigenciaTermino).toISOString() : null,



      contacto: contacto,

      rubrosInteres: rubrosInteres,
      correoSuscriptor: solicitudForm.correoSuscriptor,
      telSuscriptor: solicitudForm.telSuscriptor,
      coordinador: solicitudForm.coordinador,
      correoCoordinador: solicitudForm.correoCoordinador,
      telCoordinador: solicitudForm.telCoordinador,
      territorial: solicitudForm.territorial,
      territorialOtra: solicitudForm.territorialOtra,
      representante: solicitudForm.representante,
      correoRepresentante: solicitudForm.correoRepresentante,
      telRepresentante: solicitudForm.telRepresentante,
    }));

    console.log('📦 JSON enviado al backend:', JSON.stringify({ visitas }, null, 2));

    const API_URL = import.meta.env.VITE_API_URL;

    const response = await fetch(`${API_URL}/api/visitas-multiples`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitas }),
      credentials: 'include'
    });


    if (!response.ok) {
      throw new Error('Error al registrar visitas en la base de datos');
    }

    console.log('✅ Todas las visitas se registraron correctamente en la base de datos.');
  } catch (error) {
    console.error('❌ Error al guardar visitas:', error);
    alert('Error al guardar la solicitud. Revisa los campos o intenta más tarde.');
  }
}

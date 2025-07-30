-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rol" TEXT NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reporte" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calificacionGeneral" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Reporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seccion" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Seccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pregunta" (
    "id" SERIAL NOT NULL,
    "texto" TEXT NOT NULL,
    "seccionId" INTEGER NOT NULL,
    "opciones" TEXT NOT NULL,

    CONSTRAINT "Pregunta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Respuesta" (
    "id" SERIAL NOT NULL,
    "reporteId" INTEGER NOT NULL,
    "preguntaId" INTEGER NOT NULL,
    "respuesta" TEXT NOT NULL,
    "calificacion" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Respuesta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visita" (
    "id" SERIAL NOT NULL,
    "suscriptor" TEXT NOT NULL,
    "asegurado" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cobertura" TEXT NOT NULL,
    "giro" TEXT NOT NULL,
    "fechaSolicitud" TIMESTAMP(3) NOT NULL,
    "fechaVisita" TIMESTAMP(3),
    "estatus" TEXT NOT NULL DEFAULT 'En espera',
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "tipoMoneda" TEXT,
    "cp" TEXT,
    "ingeniero" TEXT,
    "fechaCancelacion" TIMESTAMP(3),
    "fechaVisitada" TIMESTAMP(3),
    "correoSuscriptor" TEXT,
    "telSuscriptor" TEXT,
    "coordinador" TEXT,
    "correoCoordinador" TEXT,
    "telCoordinador" TEXT,
    "territorial" TEXT,
    "territorialOtra" TEXT,
    "representante" TEXT,
    "correoRepresentante" TEXT,
    "telRepresentante" TEXT,

    CONSTRAINT "Visita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "visitaId" INTEGER NOT NULL,

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ubicacion" (
    "id" SERIAL NOT NULL,
    "direccion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "cp" TEXT,
    "suma" TEXT,
    "tipoMoneda" TEXT,
    "latitud" DOUBLE PRECISION,
    "longitud" DOUBLE PRECISION,
    "visitaId" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RubrosInteres" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "visitaId" INTEGER NOT NULL,

    CONSTRAINT "RubrosInteres_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- AddForeignKey
ALTER TABLE "Reporte" ADD CONSTRAINT "Reporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pregunta" ADD CONSTRAINT "Pregunta_seccionId_fkey" FOREIGN KEY ("seccionId") REFERENCES "Seccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Respuesta" ADD CONSTRAINT "Respuesta_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RubrosInteres" ADD CONSTRAINT "RubrosInteres_visitaId_fkey" FOREIGN KEY ("visitaId") REFERENCES "Visita"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

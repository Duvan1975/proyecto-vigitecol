import Swal from "sweetalert2";
import { authFetch } from "../utils/authFetch";

export async function AgregarTabla(
    contrato,
    familiares,
    cursos,
    estudios,
    experienciasLaborales,
    afiliaciones,
    documentos,
    vehiculos,
    empleado,
    limpiarFormulario) {

    try {
        const responseEmpleado = await authFetch("http://localhost:8080/empleados", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(
                empleado),
        });

        if (!responseEmpleado.ok) {
            const errores = await responseEmpleado.json();
            let mensaje = "Error en el registro del empleado";

            if (Array.isArray(errores)) {
                // Caso: errores de validación múltiples
                mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join('<br>');
            } else if (errores.campo && errores.error) {
                // Caso: error individual con campo (por ejemplo enum mal enviado)
                mensaje = `<strong>${errores.campo}</strong>: ${errores.error}`;
            } else if (errores.error) {
                // Caso: error general sin campo
                mensaje = errores.error;
            } else {
                mensaje = 'Ocurrió un error desconocido';
            }
            throw new Error(mensaje);
        }

        const empleadoData = await responseEmpleado.json();
        const empleadoId = empleadoData.id || empleadoData.Id;

        // 2. Enviar todos los familiares juntos
        const familiaresLimpios = familiares.filter(f =>
            f.tipoFamiliar && f.nombreFamiliar && f.edadFamiliar)
            .map((f) => ({
                tipoFamiliar: f.tipoFamiliar,
                nombreFamiliar: f.nombreFamiliar,
                edadFamiliar: parseInt(f.edadFamiliar) || 0
            }));

        if (familiaresLimpios.length > 0) {
            const responseFamiliares = await authFetch(`http://localhost:8080/familiares/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(familiaresLimpios)
            });

            if (!responseFamiliares.ok) {
                const errorData = await responseFamiliares.json();
                throw new Error(errorData.message || "Error al registrar familiares");
            }
        }

        //Enviamos todos los cursos juntos
        const cursosLimpios = cursos.filter(c =>
            c.tipoCurso && c.categoria && c.fechaCurso
        ).map((c) => ({
            tipoCurso: c.tipoCurso,
            categoria: c.categoria,
            fechaCurso: c.fechaCurso
        }));

        if (cursosLimpios.length > 0) {
            const responseCursos = await authFetch(`http://localhost:8080/cursos/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(cursosLimpios)
            });

            if (!responseCursos.ok) {
                const errorData = await responseCursos.json();
                throw new Error(errorData.message || "Error al registrar cursos");
            }
        }

        //Enviamos todos los estudios juntos
        const estudiosLimpios = estudios.filter(e =>
            e.tipoEstudio && e.nombreEstudio && e.fechaEstudio
        ).map((e) => ({
            tipoEstudio: e.tipoEstudio,
            nombreEstudio: e.nombreEstudio,
            fechaEstudio: e.fechaEstudio
        }));

        if (estudiosLimpios.length > 0) {
            const responseEstudios = await authFetch(`http://localhost:8080/estudios/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(estudiosLimpios)
            });

            if (!responseEstudios.ok) {
                const errorData = await responseEstudios.json();
                throw new Error(errorData.message || "Error al registrar estudios");
            }
        }

        //Enviamos todos las Experiencias Laborales
        const experienciasLaboralesLimpias = experienciasLaborales.filter(ex =>
            ex.descripcionExperiencia
        ).map((ex) => ({
            descripcionExperiencia: ex.descripcionExperiencia
        }));

        if (experienciasLaboralesLimpias.length > 0) {
            const responseExperienciasLaborales = await authFetch(`http://localhost:8080/experienciasLaborales/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(experienciasLaboralesLimpias)
            });

            if (!responseExperienciasLaborales.ok) {
                const errorData = await responseExperienciasLaborales.json();
                throw new Error(errorData.message || "Error al registrar experiencia laboral");
            }
        }

        //Enviamos todos las afiliaciones juntas
        const afiliacionesLimpias = afiliaciones.filter(af =>
            af.tipoAfiliacion && af.nombreEntidad && af.fechaAfiliacion
        ).map((af) => ({
            tipoAfiliacion: af.tipoAfiliacion,
            nombreEntidad: af.nombreEntidad,
            fechaAfiliacion: af.fechaAfiliacion
        }));

        if (afiliacionesLimpias.length > 0) {
            const responseAfiliaciones = await authFetch(`http://localhost:8080/afiliaciones/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(afiliacionesLimpias)
            });

            if (!responseAfiliaciones.ok) {
                const errorData = await responseAfiliaciones.json();
                throw new Error(errorData.message || "Error al registrar afiliaciones");
            }
        }

        //Enviamos todos los documentos juntos
        const documentosLimpios = documentos.filter(d =>
            d.tipoDocumento && d.descripcionDocumento && d.fechaRegistro
        ).map((d) => ({
            tipoDocumento: d.tipoDocumento,
            descripcionDocumento: d.descripcionDocumento,
            fechaRegistro: d.fechaRegistro
        }));

        if (documentosLimpios.length > 0) {
            const responseDocumentos = await authFetch(`http://localhost:8080/documentos/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(documentosLimpios)
            });

            if (!responseDocumentos.ok) {
                const errorData = await responseDocumentos.json();
                throw new Error(errorData.message || "Error al registrar documentos");
            }
        }

        //Enviamos todos los vehículos juntos
        const vehiculosLimpios = vehiculos.filter(v =>
            v.tipoVehiculo && v.tecnomecanico && v.soat && v.licencia && v.placa
        ).map((v) => ({
            tipoVehiculo: v.tipoVehiculo, 
            tecnomecanico: v.tecnomecanico, 
            soat: v.soat, 
            licencia: v.licencia, 
            placa: v.placa
        }));

        if (vehiculosLimpios.length > 0) {
            const responseVehiculos = await authFetch(`http://localhost:8080/vehiculos/${empleadoId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(vehiculosLimpios)
            });

            if (!responseVehiculos.ok) {
                const errorData = await responseVehiculos.json();
                throw new Error(errorData.message || "Error al registrar vehículos");
            }
        }

        const responseContratos = await authFetch(`http://localhost:8080/contratos/${empleadoId}`, {

            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(
                contrato
            ),
        });
        if (!responseContratos.ok) {
            throw new Error("Error al registrar el contrato");
        }

        Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Empleado registrado correctamente.",
        }).then(() => {
            if (typeof limpiarFormulario === "function") {
                limpiarFormulario();
            }
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error en el formulario",
            html: error.message,
        });
    }
};

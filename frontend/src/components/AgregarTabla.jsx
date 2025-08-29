import Swal from "sweetalert2";
import { authFetch } from "../utils/authFetch";

export async function AgregarTabla(
    contrato,
    familiares,
    cursos,
    estudios,
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

        //Enviamos todos los cursos juntos
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

import Swal from "sweetalert2";
export async function AgregarTabla(contrato, familiares, empleado, limpiarFormulario) {

    try {
        const responseEmpleado = await fetch("http://localhost:8080/empleados", {
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
            const responseFamiliares = await fetch(`http://localhost:8080/familiares/${empleadoId}`, {
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

        const responseContratos = await fetch(`http://localhost:8080/contratos/${empleadoId}`, {

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

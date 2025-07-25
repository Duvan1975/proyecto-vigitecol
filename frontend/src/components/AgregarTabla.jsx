import Swal from "sweetalert2";
export async function AgregarTabla(contrato) {

    const datosEmpleado = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        tipoDocumento: document.getElementById('tipoDocumento').value,
        numeroDocumento: document.getElementById('numeroDocumento').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        lugarNacimiento: document.getElementById('lugarNacimiento').value,
        ciudadExpedicion: document.getElementById('ciudadExpedicion').value,
        libretaMilitar: document.getElementById('libretaMilitar').value,
        estadoCivil: document.getElementById('estadoCivil').value,
        genero: document.getElementById('genero').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        tipoEmpleado: document.getElementById('tipoEmpleado').value,
        cargo: document.getElementById('cargo').value,
    };

    try {
        const responseEmpleado = await fetch("http://localhost:8080/empleados", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(datosEmpleado),
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

        const responseContratos = await fetch(`http://localhost:8080/contratos/${empleadoId}`, {

            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                contrato
            }),
        });
        if (!responseContratos.ok) {
            throw new Error("Error al registrar el contrato");
        }

        Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Empleado y contratos registrados correctamente.",
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error en el formulario",
            html: error.message,
        });
    }
};

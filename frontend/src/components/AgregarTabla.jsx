import Swal from "sweetalert2";
export function AgregarTabla() {

    const datos = {
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

    fetch("http://localhost:8080/empleados", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(datos),
    })
        .then(async (response) => {
            if (!response.ok) {
                const errores = await response.json();

                let mensaje;

                if (Array.isArray(errores)) {
                    // Caso: errores de validación (nombre, apellido, etc.)
                    mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join('<br>');
                } else if (errores.error) {
                    // Caso: error general como "Correo duplicado"
                    mensaje = errores.error;
                } else {
                    mensaje = 'Ocurrió un error desconocido';
                }

                throw new Error(mensaje);
            }
            return response.text();
        })
        .then((data) => {
            Swal.fire({
                icon: 'success',
                title: 'Registro exitoso',
                text: 'La persona ha sido registrada correctamente.',
            });
        })
        .catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Error en el formulario',
                html: error.message, // Puede ser lista o mensaje general
            });
        });
}

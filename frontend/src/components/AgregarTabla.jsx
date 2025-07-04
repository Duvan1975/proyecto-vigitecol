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
            const errores = await response.json(); // Esto ahora sí funciona
            const mensajes = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join('<br>');
            throw new Error(mensajes); // Disparamos los errores
        }
        return response.json();
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
            html: error.message, // mostramos todos los errores formateados
        });
    });
}

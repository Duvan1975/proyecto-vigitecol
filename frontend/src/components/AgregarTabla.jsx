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

            return response.json();
        })
        .then((data) => {
    Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El empleado ha sido registrado correctamente.',
    });

    const contrato = {
        numeroContrato: 0, // El backend asigna el número automáticamente
        fechaIngreso: "2025-07-20", // Puedes tomarlo desde un input tipo date
        fechaRetiro: null,
        fechaRenuncia: null,
        fechaOtroSi: null,
        omiso: "",
        continua: true,
        vacacionesDesde: null,
        vacacionesHasta: null,
        empleadoId: data.id // Asegúrate que backend devuelva esto
    };

    return fetch(`http://localhost:8080/contratos/${data.id}`, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(contrato),
    });
})
.then((responseContrato) => {
    if (!responseContrato.ok) {
        throw new Error("Error al registrar el contrato");
    }
    Swal.fire({
        icon: 'success',
        title: 'Contrato registrado',
        text: 'El contrato fue asignado al empleado.',
    });
})


}

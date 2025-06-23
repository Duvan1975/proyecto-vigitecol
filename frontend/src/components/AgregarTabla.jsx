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
        .then((response) => {
            if (!response.ok) {
                throw new ("Error al registrar");
            }
            return response.text();
        })
        .then((data) => {
            alert("Registro Exitoso");
            agregarFila(datos);
        })
        .catch((error) => {
            console.error("Error", error);
            alert("Se presento un problema al registrar");
        });

    function agregarFila(datos) {
        const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
        const fila = tabla.insertRow(0);

        fila.insertCell(0).innerText = datos.nombres;
        fila.insertCell(1).innerText = datos.apellidos;
        fila.insertCell(2).innerText = datos.tipoDocumento;
        fila.insertCell(3).innerText = datos.numeroDocumento;
        fila.insertCell(4).innerText = datos.fechaNacimiento;
        fila.insertCell(5).innerText = datos.lugarNacimiento;
        fila.insertCell(6).innerText = datos.ciudadExpedicion;
        fila.insertCell(7).innerText = datos.libretaMilitar;
        fila.insertCell(8).innerText = datos.estadoCivil;
        fila.insertCell(9).innerText = datos.genero;
        fila.insertCell(10).innerText = datos.direccion;
        fila.insertCell(11).innerText = datos.telefono;
        fila.insertCell(12).innerText = datos.correo;
        fila.insertCell(13).innerText = datos.tipoEmpleado;
        fila.insertCell(14).innerText = datos.cargo;
    }

};
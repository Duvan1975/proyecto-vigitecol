export function AgregarTabla() {

    const nombres = document.getElementById('nombres').value;
    const apellidos = document.getElementById('apellidos').value;
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;
    const lugarNacimiento = document.getElementById('lugarNacimiento').value;
    const ciudadExpedicion = document.getElementById('ciudadExpedicion').value;
    const libretaMilitar = document.getElementById('libretaMilitar').value;
    const estadoCivil = document.getElementById('estadoCivil').value;
    const genero = document.getElementById('genero').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const tipoEmpleado = document.getElementById('tipoEmpleado').value;
    const cargo = document.getElementById('cargo').value;

    const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];

    var fila = tabla.insertRow(0);

    var columna1 = fila.insertCell(0);
    var columna2 = fila.insertCell(1);
    var columna3 = fila.insertCell(2);
    var columna4 = fila.insertCell(3);
    var columna5 = fila.insertCell(4);
    var columna6 = fila.insertCell(5);
    var columna7 = fila.insertCell(6);
    var columna8 = fila.insertCell(7);
    var columna9 = fila.insertCell(8);
    var columna10 = fila.insertCell(9);
    var columna11 = fila.insertCell(10);
    var columna12 = fila.insertCell(11);
    var columna13 = fila.insertCell(12);
    var columna14 = fila.insertCell(13);
    var columna15 = fila.insertCell(14);

    columna1.innerText = nombres;
};
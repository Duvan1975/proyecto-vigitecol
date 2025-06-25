import { useEffect, useState } from "react";

export function Tabla() {

    const [empleados, setEmpleados] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/empleados")
        .then((response) => response.json())
        .then((data) => setEmpleados(data.content))
        .catch((error) => console.error("Error al cargar empleados:", error));
    }, []);

    const eliminarEmpleado = async (id) => {
        console.log("Id a eliminar:", id); //Prueba en consola
        try {
            const response = await fetch(`http://localhost:8080/empleados/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                //Eliminar del estado para actualizar la tabla
                setEmpleados(empleados.filter(empleado => empleado.id !== id));
            }
            else {
                console.error("Error al eliminar empleado")
            }
        } catch (error) {
            console.error("Error en la petición DELETE", error);
        }
    };

    return (
        <table className="table table-bordered border-primary table-hover" id="tabla">
            <thead>
                <tr>
                    <th>Nombres</th>
                    <th>Apellidos</th>
                    <th>Número Documento</th>
                    <th>Edad</th>
                    <th>Estado Civil</th>
                    <th>Teléfono</th>
                    <th>Correo</th>
                    <th>Cargo</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {empleados.map((emp,index) => (
                    <tr key={index}>
                        <td>{emp.nombres}</td>
                        <td>{emp.apellidos}</td>
                        <td>{emp.numeroDocumento}</td>
                        <td>{emp.edad}</td>
                        <td>{emp.estadoCivil}</td>
                        <td>{emp.telefono}</td>
                        <td>{emp.correo}</td>
                        <td>{emp.cargo}</td>
                        <td>
                            <button onClick={() => eliminarEmpleado(emp.id)} className="btn btn-danger">Eliminar</button>
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table>
    )
};
import { useEffect, useState } from "react";
import { ModalEditar } from "./ModalEditar";

export function Tabla() {

    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const cargarEmpleados = () => {
        fetch("http://localhost:8080/empleados")
            .then((response) => response.json())
            .then((data) => setEmpleados(data.content))
            .catch((error) => console.error("Error al cargar empleados:", error));
    };

    useEffect(() => {
        fetch("http://localhost:8080/empleados/activos")
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
        <>
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
                    {empleados.map((emp, index) => (
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
                                <button onClick={() => {
                                    setEmpleadoSeleccionado(emp);
                                    setMostrarModal(true);
                                }}
                                    className="btn btn-sm btn-primary me-2"
                                >Editar
                                </button>
                                <button onClick={() => eliminarEmpleado(emp.id)}
                                    className="btn btn-danger"
                                >Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <ModalEditar
                empleado={empleadoSeleccionado} // Le envía al modal los datos de la persona que se quiere editar.
                visible={mostrarModal} //Controla si el modal debe mostrarse (true) o no (false).
                onClose={() => setMostrarModal(false)} //Función que se ejecuta cuando el usuario cierra el modal.
                onActualizada={(empleadoActualizado) => {
                    setEmpleados(empleados.map(e => e.id === empleadoActualizado.id ? empleadoActualizado : e));
                }}
            />
        </>
    )
};
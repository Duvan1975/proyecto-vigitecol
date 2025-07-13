import { useEffect, useState } from "react";
import { ModalEditar } from "./ModalEditar";
import Swal from "sweetalert2";

export function Tabla({ mostrarInactivos = false }) {

    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estados para buscar por ID
    const [idBuscar, setIdBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState(null);

    useEffect(() => {
        cargarEmpleados();
        // eslint-disable-next-line
    }, [mostrarInactivos]);

    //Cargando el listado de Empleados activos y retirados
    const cargarEmpleados = () => {
        const url = mostrarInactivos
            ? "http://localhost:8080/empleados/inactivos"
            : "http://localhost:8080/empleados/activos";

        fetch(url)
            .then((response) => response.json())
            .then((data) => setEmpleados(data.content))
            .catch((error) => console.error("Error al cargar empleados:", error));
    };

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
    const buscarEmpleadoPorId = () => {
        if (!idBuscar) {
            Swal.fire({
                icon: "warning",
                title: "ID requerido",
                text: "Por favor ingrese un ID válido.",
            });
            return;
        }
        //Buscar empleado de acuerdo al listado (activo inactivo)
        const endpoint = mostrarInactivos
            ? `http://localhost:8080/empleados/obtenerinactivos/${idBuscar}`
            : `http://localhost:8080/empleados/obteneractivos/${idBuscar}`;

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error("Empleado no encontrado");
                return res.json();
            })
            .then((data) => {
                setResultadoBusqueda(data);
                // Mensaje de éxito muestra nombre y apellido de la persona encontrada
                Swal.fire({
                    icon: "success",
                    title: "Persona encontrada",
                    text: `Nombre: ${data.nombres} ${data.apellidos}`,
                    timer: 3000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);

                // Mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontró el empleado con ese ID.",
                });

                setResultadoBusqueda(null);
            });
    }

    return (
        <>
            <div className="mb-4">
                <h5>Buscar Persona por ID</h5>
                <input
                    type="number"
                    value={idBuscar}
                    onChange={(e) => setIdBuscar(e.target.value)}
                    placeholder="Ingrese el ID"
                    className="form-control mb-2"
                />
                <button onClick={buscarEmpleadoPorId} className="btn btn-info">Buscar</button>
                {resultadoBusqueda && (
                    <button
                        onClick={() => {
                            setResultadoBusqueda(null);
                            setIdBuscar("");
                            cargarEmpleados(); // Esto cargará el listado completo y actualizado
                        }}
                        className="btn btn-secondary"
                    >
                        Limpiar Búsqueda
                    </button>
                )}
            </div>

            <table className={`table table-bordered border-primary table-striped table-hover 
                ${mostrarInactivos ? "table-warning" : "table-light"} `} id="tabla">
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
                    {resultadoBusqueda ? (
                        <tr>
                            <td>{resultadoBusqueda.nombres}</td>
                            <td>{resultadoBusqueda.apellidos}</td>
                            <td>{resultadoBusqueda.numeroDocumento}</td>
                            <td>{resultadoBusqueda.edad}</td>
                            <td>{resultadoBusqueda.estadoCivil}</td>
                            <td>{resultadoBusqueda.telefono}</td>
                            <td>{resultadoBusqueda.correo}</td>
                            <td>{resultadoBusqueda.cargo}</td>
                            <td>
                                <button onClick={() => {
                                    setEmpleadoSeleccionado(resultadoBusqueda);
                                    setMostrarModal(true);
                                }}
                                    className="btn btn-sm btn-primary me-2"
                                >Editar
                                </button>
                                <button
                                    onClick={() => {
                                        Swal.fire({
                                            title: '¿Estás seguro?',
                                            text: "Esta acción eliminará la persona.",
                                            icon: 'warning',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            confirmButtonText: 'Sí, eliminar',
                                            cancelButtonText: 'Cancelar'
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                eliminarEmpleado(resultadoBusqueda.id);
                                                Swal.fire(
                                                    'Eliminado',
                                                    'La persona ha sido eliminada.',
                                                    'success'
                                                );
                                            }
                                        });
                                    }}
                                    className="btn btn-sm btn-danger"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ) : (
                        empleados.map((emp, index) => (
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
                                    <button
                                        onClick={() => {
                                            Swal.fire({
                                                title: '¿Estás seguro?',
                                                text: "Esta acción eliminará al empleado.",
                                                icon: 'warning',
                                                showCancelButton: true,
                                                confirmButtonColor: '#3085d6',
                                                cancelButtonColor: '#d33',
                                                confirmButtonText: 'Sí, eliminar',
                                                cancelButtonText: 'Cancelar'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    eliminarEmpleado(emp.id);
                                                    Swal.fire(
                                                        'Eliminado',
                                                        'La persona ha sido eliminada.',
                                                        'success'
                                                    );
                                                }
                                            });
                                        }}
                                        className="btn btn-sm btn-danger"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <ModalEditar
                empleado={empleadoSeleccionado} // Le envía al modal los datos de la persona que se quiere editar.
                visible={mostrarModal} //Controla si el modal debe mostrarse (true) o no (false).
                onClose={() => setMostrarModal(false)} //Función que se ejecuta cuando el usuario cierra el modal.
                onActualizado={(empleadoActualizado) => {
                    setEmpleados(empleados.map(e => e.id === empleadoActualizado.id ? empleadoActualizado : e));
                }}
            />
        </>
    )
};
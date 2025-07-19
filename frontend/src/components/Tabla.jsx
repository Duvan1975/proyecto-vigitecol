import { useEffect, useState } from "react";
import { ModalEditar } from "./ModalEditar";
import Swal from "sweetalert2";

export function Tabla({ mostrarInactivos = false }) {

    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    //Estado para buscar por nombre
    const [nombreBuscar, setNombreBuscar] = useState("");
    const [resultadoBusqueda, setResultadoBusqueda] = useState([]);

    //Estado para buscar por documento
    const [documentoBuscar, setDocumentoBuscar] = useState("");

    //Estado para controlar el tipo de busqueda
    const [tipoBusqueda, setTipoBusqueda] = useState("nombre");

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

    //Búsqueda de empleados por nombre
    const buscarEmpleadoPorNombre = () => {
        if (!nombreBuscar || nombreBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Nombre requerido",
                text: "Por favor ingrese un nombre válido.",
            });
            return;
        }
        //Aquí mostramos el endpoint de búsqueda
        const endpoint = mostrarInactivos
            ? `http://localhost:8080/empleados/obtenerinactivos/${nombreBuscar}`
            : `http://localhost:8080/empleados/buscar/activos?filtro=${nombreBuscar}`;

        fetch(endpoint)
            .then((res) => {
                if (!res.ok) throw new Error("Empleado no encontrado");
                return res.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    setResultadoBusqueda([]);
                } else {
                    setResultadoBusqueda(data); // Tratamos data como un array y tomamos la primera persona
                }
                // Mensaje de éxito muestra nombre y apellido de la persona encontrada
                Swal.fire({
                    icon: "success",
                    title: "Empleado(s) encontrado(s)",
                    text: `${data.length} coincidencias encontradas`,
                    timer: 2000,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);

                // Mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: "No se encontró el empleado con ese NOMBRE.",
                });

                setResultadoBusqueda(null);
            });
    };
    //Manejar busqueda controla el tipo de busqueda
    const manejarBusqueda = () => {
        if (tipoBusqueda === "nombre") {
            buscarEmpleadoPorNombre();
        } else {
            buscarEmpleadoPorDocumento();
        }
    };
    //Function busqueda de empleados por documento
    const buscarEmpleadoPorDocumento = () => {
        if (!documentoBuscar || documentoBuscar.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Número de Documento Requerido",
                text: "Por favor ingrese un número válido.",
            });
            return;
        }
        fetch(`http://localhost:8080/empleados/buscar/activos/documento?numeroDocumento=${documentoBuscar}`)
            .then((res) => {
                if (!res.ok) throw new Error("Empleado NO encontrado");
                return res.json();
            })
            .then((data) => {
                if (!data || data.length === 0) {
                    throw new Error("No se encontró el empleado con ese número de documento.");
                }

                setResultadoBusqueda(data);

                Swal.fire({
                    icon: "success",
                    title: "Empleado encontrado",
                    text: `Nombre: ${data[0].nombres} ${data[0].apellidos}`,
                    timer: 2500,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);

                // Mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "No encontrado",
                    text: error.message || "No se encontró el empleado con ese número de documento.",
                });

                setResultadoBusqueda([]);
            });
    };

    return (
        <>
            <div className="mb-4">
                <h5>Buscar Empleado por:</h5>
                <div className="row">
                    <div className="col-md-4">
                        <select class="form-select"
                            aria-label="Default select example"
                            onChange={(e) => setTipoBusqueda(e.target.value)}
                            value={tipoBusqueda}>

                            <option value="nombre">Por Nombre</option>
                            <option value="documento">Por Documento</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <input
                            type={tipoBusqueda === "nombre" ? "text" : "number"}
                            value={tipoBusqueda === "nombre" ? nombreBuscar : documentoBuscar}
                            onChange={(e) =>
                                tipoBusqueda === "nombre"
                                    ? setNombreBuscar(e.target.value)
                                    : setDocumentoBuscar(e.target.value)
                            }
                            placeholder={`Ingrese ${tipoBusqueda}`}
                            className="form-control mb-2"
                        />
                    </div>
                </div>

                <button onClick={manejarBusqueda}
                    className="btn btn-info">Buscar</button>
                {resultadoBusqueda && (
                    <button
                        onClick={() => {
                            setResultadoBusqueda([]);
                            setDocumentoBuscar("");
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
                <thead className="table-primary">
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
                    {resultadoBusqueda.length > 0 ? (
                        resultadoBusqueda.map((emp, index) => (
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
                                    >Editar</button>

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
                                    >Eliminar</button>
                                </td>
                            </tr>
                        ))
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

                    setMostrarModal(false);
                    setNombreBuscar("");
                    setResultadoBusqueda(resultadoBusqueda.map(emp => emp.id === empleadoActualizado.id ? empleadoActualizado : emp));
                    setEmpleados(empleados.map(e => e.id === empleadoActualizado.id ? empleadoActualizado : e));
                }}
            />
        </>
    )
};
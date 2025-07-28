import { useEffect, useState } from "react";
import { ModalEditar } from "./ModalEditar";
import { TablaContrato } from "./TablaContrato";
import Swal from "sweetalert2";
import Paginacion from "./Paginacion";

export function Tabla({ mostrarInactivos = false }) {

    //Estados para seleccionar empleado mostrar Modal y actualizar
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

    //Estados para controlar la paginación
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(3);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);

    useEffect(() => {
        cargarEmpleados(paginaActual);
        // eslint-disable-next-line
    }, [mostrarInactivos, paginaActual]);

    //Cargando el listado de Empleados activos y retirados
    const cargarEmpleados = (pagina = 0) => {
        const url = mostrarInactivos
            ? `http://localhost:8080/empleados/inactivos?page=${pagina}`
            : `http://localhost:8080/empleados/activos?page=${pagina}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setEmpleados(data.content);
                setTotalPaginas(data.totalPages); //Muestra el total de las páginas
                setPaginaActual(data.number); //Muestra el número actual de la página
                setTotalElementos(data.totalElements); //Trae el número de elementos de la todas las páginas
                setTamanoPagina(data.size); //Muestra la cantidad de elementos por página
            })
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
                cargarEmpleados(); // Esto cargará el listado completo y actualizado
            }
            else {
                console.error("Error al eliminar empleado")
            }
        } catch (error) {
            console.error("Error en la petición DELETE", error);
        }
    };

    const manejarBusqueda = () => {
        if (tipoBusqueda === "nombre") {
            if (!nombreBuscar || nombreBuscar.trim() === "") {
                Swal.fire({
                    icon: "warning",
                    title: "Nombre requerido",
                    text: "Por favor ingrese un nombre válido.",
                });
                return;
            }

            const url = mostrarInactivos
                ? `http://localhost:8080/empleados/buscar/inactivos?filtro=${nombreBuscar}`
                : `http://localhost:8080/empleados/buscar/activos?filtro=${nombreBuscar}`;

            realizarBusqueda(url);
        } else {
            if (!documentoBuscar || documentoBuscar.trim() === "") {
                Swal.fire({
                    icon: "warning",
                    title: "Número de documento requerido",
                    text: "Por favor ingrese un número válido.",
                });
                return;
            }

            const url = mostrarInactivos
                ? `http://localhost:8080/empleados/buscar/inactivos/documento?numeroDocumento=${documentoBuscar}`
                : `http://localhost:8080/empleados/buscar/activos/documento?numeroDocumento=${documentoBuscar}`;

            realizarBusqueda(url);
        }
    };

    const realizarBusqueda = (url) => {
        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Error al buscar empleado");
                return res.json();
            })
            .then((data) => {
                if (data.length === 0) {
                    setResultadoBusqueda([]); // vaciamos resultados si no hay datos

                    Swal.fire({
                        icon: "info",
                        title: "Sin resultados",
                        text: "No se encontró ningún empleado con ese dato.",
                        timer: 2500,
                        showConfirmButton: false,
                    });

                    return; // salimos para no mostrar el mensaje de éxito
                }

                setResultadoBusqueda(data);

                Swal.fire({
                    icon: "success",
                    title: "Empleado(s) encontrado(s)",
                    text:
                        data.length === 1
                            ? `${data[0].nombres} ${data[0].apellidos}`
                            : `${data.length} coincidencia(s) encontrada(s)`,
                    timer: 2500,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error en la búsqueda", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al buscar el empleado.",
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
                        <select className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => setTipoBusqueda(e.target.value)}
                            value={tipoBusqueda}>

                            <option value="nombre">Por Nombre</option>
                            <option value="documento">Por Documento</option>
                            <option value="conContrato">Por Contrato</option>

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
                            setNombreBuscar("");
                            cargarEmpleados(); // Esto cargará el listado completo y actualizado
                        }}
                        className="btn btn-secondary"
                    >
                        Limpiar Búsqueda
                    </button>
                )}

            </div>
            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                />
            )}
            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                <div className="mt-2 text-center">
                    <small>
                        Mostrando página {paginaActual + 1} de {totalPaginas} —{" "}
                        {tamanoPagina} por página, total de registros: {totalElementos}
                    </small>
                </div>
            )}
            {tipoBusqueda === "conContrato" && (
                <div className="mt-4">
                    <TablaContrato />
                </div>
            )}

            {tipoBusqueda !== "conContrato" && (
                <>
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
                                empleados.map((emp) => (
                                    <tr key={emp.id}>
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
                </>
            )}

            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                />
            )}
            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                <div className="mt-2 text-center">
                    <small>
                        Mostrando página {paginaActual + 1} de {totalPaginas} —{" "}
                        {tamanoPagina} por página, total de registros: {totalElementos}
                    </small>
                </div>
            )}

            <ModalEditar
                empleado={empleadoSeleccionado}
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onActualizado={(accion, empleadoActualizado) => {
                    setMostrarModal(false);
                    setNombreBuscar("");

                    if (accion === "recargar") {
                        cargarEmpleados(paginaActual); // Esta función ya la tienes definida
                    } else {
                        setResultadoBusqueda(resultadoBusqueda.map(emp =>
                            emp.id === empleadoActualizado.id ? empleadoActualizado : emp
                        ));
                        setEmpleados(empleados.map(e =>
                            e.id === empleadoActualizado.id ? empleadoActualizado : e
                        ));
                    }
                }}
            />

        </>
    )
};
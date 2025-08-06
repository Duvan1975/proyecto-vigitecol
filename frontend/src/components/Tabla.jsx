import { useEffect, useState } from "react";
import { ModalEditar } from "./ModalEditar";
import { TablaContrato } from "./TablaContrato";
import { TablaContratosPorEmpleado } from "./TablaContratosPorEmpleado";
import Swal from "sweetalert2";
import Paginacion from "./Paginacion";

export function Tabla({
    mostrarInactivos = false,
    mostrarAdministrativos = false,
    mostrarOperativos = false,
    sinContrato = false,
    mostrarSupervisores = false,
}) {

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

    //Estados para cargar y controlar el historial de contratos
    const [empleadoParaHistorial, setEmpleadoParaHistorial] = useState(null);
    const [mostrarTablaContratos, setMostrarTablaContratos] = useState(false);
    const [contadorActualizacion, setContadorActualizacion] = useState(0);

    //Estados de búsqueda
    const [estadoCivilBuscar, setEstadoCivilBuscar] = useState("");
    const [generoBuscar, setGeneroBuscar] = useState("");

    useEffect(() => {
        cargarEmpleados(paginaActual);
        // eslint-disable-next-line
    }, [mostrarInactivos,
        mostrarAdministrativos,
        mostrarOperativos,
        mostrarSupervisores,
        estadoCivilBuscar,
        generoBuscar,
        paginaActual]);

    useEffect(() => {
        if (tipoBusqueda === "sinContrato" ||
            tipoBusqueda === "personalMayorDe50" ||
            tipoBusqueda === "estadoCivil" ||
            tipoBusqueda === "genero") {
            cargarEmpleados(paginaActual);
        }
        // eslint-disable-next-line
    }, [tipoBusqueda, paginaActual]);


    //Cargando el listado de Empleados activos, retirados, operativos, supervisores y administrativos
    const cargarEmpleados = (pagina = 0) => {
        let url;

        if (sinContrato || tipoBusqueda === "sinContrato") {
            url = `http://localhost:8080/empleados/sin-contrato?page=${pagina}`;

        } else if (tipoBusqueda === "estadoCivil" && estadoCivilBuscar) {
            url = `http://localhost:8080/empleados/estado-civil?estadoCivil=${estadoCivilBuscar}&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "genero" && generoBuscar) {
            url = `http://localhost:8080/empleados/genero?genero=${generoBuscar}&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "personalMayorDe50") {
            url = `http://localhost:8080/empleados/activos/mayores-de-50?page=${pagina}`;
        } else if (mostrarAdministrativos) {
            url = `http://localhost:8080/empleados/administrativos/activos?page=${pagina}`;
        } else if (mostrarOperativos) {
            url = `http://localhost:8080/empleados/operativos/activos?page=${pagina}`;
        } else if (mostrarSupervisores) {
            url = `http://localhost:8080/empleados/supervisores/activos?page=${pagina}`;
        } else {
            url = mostrarInactivos
                ? `http://localhost:8080/empleados/inactivos?page=${pagina}`
                : `http://localhost:8080/empleados/activos?page=${pagina}`;
        }

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                if (data.content.length > data.totalElements) {
                    console.warn('Discrepancia detectada!', {
                        contentLength: data.content.length,
                        totalElements: data.totalElements
                    });
                }
                setEmpleados(data.content);
                setTotalPaginas(data.totalPages);
                setPaginaActual(data.number);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
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

    const realizarBusquedaFiltrada = async (tipo, valor, nombreFiltro) => {
        if (!valor) {
            Swal.fire({
                icon: "warning",
                title: `${nombreFiltro} requerido`,
                text: `Por favor seleccione un ${nombreFiltro.toLowerCase()}.`,
            });
            return false;
        }

        let url = `http://localhost:8080/empleados/${tipo}?${tipo}=${valor}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => {

                setResultadoBusqueda(data.content);
                setTotalPaginas(data.totalPages);
                setPaginaActual(data.number);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);

                Swal.fire({
                    icon: "success",
                    title: "Búsqueda completada",
                    text: `Se encontraron ${data.totalElements} empleados por ${tipo}`,
                    timer: 2500,
                    showConfirmButton: false,
                });
            })
            .catch((error) => {
                console.error("Error al buscar por estado civil:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Ocurrió un error al buscar por estado civil",
                });
            });

        return true;
    };

    const manejarBusqueda = () => {
        setMostrarTablaContratos(false);
        setEmpleadoParaHistorial(null);

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
        if (tipoBusqueda === "sinContrato") {
            fetch("http://localhost:8080/empleados/sin-contrato")
                .then(res => res.json())
                .then(data => {
                    setResultadoBusqueda(data.content || []);
                })
                .catch(error => {
                    console.error("Error al buscar empleados sin contrato", error);
                });
            return;
        }
        else if (tipoBusqueda === "estadoCivil") {
            realizarBusquedaFiltrada("estado-civil", estadoCivilBuscar, "Estado civil");
        } else if (tipoBusqueda === "genero") {
            realizarBusquedaFiltrada("genero", generoBuscar, "Género");
        }


    };


    /*const manejarBusqueda = () => {
        setMostrarTablaContratos(false);
        setEmpleadoParaHistorial(null);

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
        } else if (tipoBusqueda === "documento") {
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
        } else if (tipoBusqueda === "estadoCivil") {
            if (!estadoCivilBuscar) {
                Swal.fire({
                    icon: "warning",
                    title: "Estado civil requerido",
                    text: "Por favor seleccione un estado civil.",
                });
                return;
            }

            const url = `http://localhost:8080/empleados/estado-civil?estadoCivil=${estadoCivilBuscar}`;

        } else if (tipoBusqueda === "genero") {
            if (!generoBuscar) {
                Swal.fire({
                    icon: "warning",
                    title: "Género requerido",
                    text: "Por favor seleccione un género.",
                });
                return;
            }

            const url = `http://localhost:8080/empleados/genero?genero=${generoBuscar}`;

            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setResultadoBusqueda(data.content);
                    setTotalPaginas(data.totalPages);
                    setPaginaActual(data.number);
                    setTotalElementos(data.totalElements);
                    setTamanoPagina(data.size);

                    Swal.fire({
                        icon: "success",
                        title: "Búsqueda completada",
                        text: `Se encontraron ${data.totalElements} empleados con estado civil ${estadoCivilBuscar}`,
                        timer: 2500,
                        showConfirmButton: false,
                    });
                })
                .catch((error) => {
                    console.error("Error al buscar por estado civil:", error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un error al buscar por estado civil",
                    });
                });
        }
    };*/

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
                <div className="row align-items-end gx-2">
                    <div className="col-md-3">
                        <label className="form-label">Tipo de búsqueda</label>
                        <select
                            className="form-select"
                            aria-label="Tipo de búsqueda"
                            onChange={(e) => setTipoBusqueda(e.target.value)}
                            value={tipoBusqueda}
                        >
                            <option value="nombre">Por Nombre</option>
                            <option value="documento">Por Documento</option>
                            <option value="conContrato">Por Contrato</option>
                            <option value="sinContrato">Sin Contrato</option>
                            <option value="personalMayorDe50">Mayores de 50 años</option>
                            <option value="estadoCivil">Estado Civil</option>
                            <option value="genero">Género</option>
                        </select>
                    </div>

                    {tipoBusqueda !== "sinContrato" &&
                        tipoBusqueda !== "estadoCivil" &&
                        tipoBusqueda !== "personalMayorDe50" &&
                        tipoBusqueda !== "genero" && (
                            <div className="col-md-5">
                                <label className="form-label">
                                    {tipoBusqueda === "nombre" ? "Nombre" : "Documento"}
                                </label>
                                <input
                                    type={tipoBusqueda === "nombre" ? "text" : "number"}
                                    value={tipoBusqueda === "nombre" ? nombreBuscar : documentoBuscar}
                                    onChange={(e) =>
                                        tipoBusqueda === "nombre"
                                            ? setNombreBuscar(e.target.value)
                                            : setDocumentoBuscar(e.target.value)
                                    }
                                    placeholder={`Ingrese ${tipoBusqueda}`}
                                    className="form-control"
                                />
                            </div>
                        )}

                    {tipoBusqueda === "estadoCivil" && (
                        <div className="col-md-5">
                            <label className="form-label">Estado Civil</label>
                            <select
                                className="form-select"
                                value={estadoCivilBuscar}
                                onChange={(e) => setEstadoCivilBuscar(e.target.value)}
                            >
                                <option value="">Seleccione un estado civil</option>
                                <option value="CASADO">CASADO(A)</option>
                                <option value="SOLTERO">SOLTERO(A)</option>
                                <option value="VIUDO">VIUDO(A)</option>
                                <option value="SEPARADO">SEPARADO(A)</option>
                                <option value="UNION_LIBRE">UNIÓN LIBRE</option>
                            </select>
                        </div>
                    )}

                    {tipoBusqueda === "genero" && (
                        <div className="col-md-5">
                            <label className="form-label">GÉNERO</label>
                            <select
                                className="form-select"
                                value={generoBuscar}
                                onChange={(e) => setGeneroBuscar(e.target.value)}
                            >
                                <option value="">Seleccione el género</option>
                                <option value="MASCULINO">MASCULINO</option>
                                <option value="FEMENINO">FEMENINO</option>

                            </select>
                        </div>
                    )}

                    <div className="col-md-4">
                        {tipoBusqueda !== "sinContrato"
                            && tipoBusqueda !== "estadoCivil"
                            && tipoBusqueda !== "personalMayorDe50"
                            && tipoBusqueda !== "genero"
                            && (
                                <button
                                    onClick={manejarBusqueda}
                                    className="btn btn-info me-2"
                                >
                                    Buscar
                                </button>
                            )}

                        {tipoBusqueda !== "sinContrato" && resultadoBusqueda && tipoBusqueda !== "personalMayorDe50" && (
                            <button
                                onClick={() => {
                                    setResultadoBusqueda([]);
                                    setDocumentoBuscar("");
                                    setNombreBuscar("");
                                    setEstadoCivilBuscar("");
                                    setGeneroBuscar("");
                                    cargarEmpleados();
                                    setMostrarTablaContratos(false);
                                }}
                                className="btn btn-secondary"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <h4 className="alinearTexto">
                {tipoBusqueda === "sinContrato"
                    ? "Listado de Empleados Sin Contrato"
                    : tipoBusqueda === "personalMayorDe50"
                        ? "Personal Mayor de 50 Años"
                        : tipoBusqueda === "estadoCivil"
                            ? `Empleados con estado civil: ${estadoCivilBuscar}`
                            : tipoBusqueda === "genero"
                                ? `Personal por género: ${generoBuscar}`
                                : mostrarAdministrativos
                                    ? "Listado de Empleados ADMINISTRATIVOS"
                                    : mostrarOperativos
                                        ? "Listado de Personal OPERATIVO"
                                        : mostrarSupervisores
                                            ? "Listado de SUPERVISORES"
                                            : mostrarInactivos
                                                ? "Listado de Empleados Retirados"
                                                : "Listado de Empleados Activos"}
            </h4>

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
    ${tipoBusqueda === "sinContrato"
                            ? "table-info"
                            : mostrarInactivos
                                ? "table-warning"
                                : "table-light"
                        }`} id="tabla">

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
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEmpleadoSeleccionado(emp);
                                                        setMostrarModal(true);
                                                    }}
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil-fill"></i>
                                                </button>
                                                {!mostrarInactivos && (
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
                                                        className="btn btn-sm btn-outline-danger me-2"
                                                        title="Desactivar"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setEmpleadoParaHistorial(emp.id);
                                                        setMostrarTablaContratos(true);  // activamos la tabla
                                                    }}
                                                    className="btn btn-sm btn-outline-secondary"
                                                    title="Ver contratos"
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>
                                            </div>

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
                                            <div className="d-flex justify-content-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEmpleadoSeleccionado(emp);
                                                        setMostrarModal(true);
                                                    }}
                                                    className="btn btn-sm btn-outline-primary me-1"
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil-fill"></i>
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEmpleadoParaHistorial(emp.id);
                                                        setMostrarTablaContratos(true);  // activamos la tabla

                                                    }}
                                                    className="btn btn-sm btn-outline-secondary"
                                                    title="Ver contratos"
                                                >
                                                    <i className="bi bi-eye-fill"></i>
                                                </button>

                                                {!mostrarInactivos && tipoBusqueda !== "sinContrato" && (
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
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="Desactivar"
                                                    >
                                                        <i className="bi bi-trash-fill"></i>
                                                    </button>
                                                )}
                                            </div>
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
            {mostrarTablaContratos && empleadoParaHistorial && (
                <TablaContratosPorEmpleado empleadoId={empleadoParaHistorial}
                    actualizar={contadorActualizacion}
                    onClose={() => setMostrarTablaContratos(false)} />
            )}

            <ModalEditar
                empleado={empleadoSeleccionado}
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                onActualizado={(accion, empleadoActualizado) => {
                    setMostrarModal(false);
                    setNombreBuscar("");
                    setContadorActualizacion(prev => prev + 1);

                    if (accion === "recargar") {
                        cargarEmpleados(paginaActual);
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

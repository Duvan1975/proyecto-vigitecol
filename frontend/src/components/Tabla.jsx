import { useEffect, useState } from "react";
import { ModalEditar } from "./ModalEditar";
import { TablaContrato } from "./TablaContrato";
import { TablaContratosPorEmpleado } from "./TablaContratosPorEmpleado";
import Swal from "sweetalert2";
import Paginacion from "./Paginacion";
import { TablaFamiliar } from "./TablaFamiliar";
import { TablaCurso } from "./TablaCurso";
import { TablaContratoConPeriodoDePrueba } from "./TablaContratoConPeriodoDePrueba";
import { authFetch } from "../utils/authFetch";

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
    const [generoBuscarFamiliares, setGeneroBuscarFamiliares] = useState("");
    const [libretaMilitarBuscar, setLibretaMilitarBuscar] = useState("");
    const [cargoBuscar, setCargoBuscar] = useState("");

    useEffect(() => {
        cargarEmpleados(paginaActual);
        // eslint-disable-next-line
    }, [mostrarInactivos,
        mostrarAdministrativos,
        mostrarOperativos,
        mostrarSupervisores,
        estadoCivilBuscar,
        generoBuscar,
        generoBuscarFamiliares,
        libretaMilitarBuscar,
        cargoBuscar,
        paginaActual]);

    useEffect(() => {
        if (tipoBusqueda === "sinContrato" ||
            tipoBusqueda === "personalMayorDe50" ||
            tipoBusqueda === "estadoCivil" ||
            tipoBusqueda === "genero" ||
            tipoBusqueda === "libretaMilitar" ||
            tipoBusqueda === "cargo" ||
            tipoBusqueda === "conFamiliares" ||
            tipoBusqueda === "familiaresPorGenero"
        ) {
            cargarEmpleados(paginaActual);
        }
        // eslint-disable-next-line
    }, [tipoBusqueda, paginaActual]);

    //Cargando el listado de Empleados activos, retirados, operativos, supervisores y administrativos
    const cargarEmpleados = (pagina = 0) => {
        let url;

        if (sinContrato || tipoBusqueda === "sinContrato") {
            url = `http://localhost:8080/empleados/sin-contrato?page=${pagina}`;

        } else if (tipoBusqueda === "personalMayorDe50") {
            url = `http://localhost:8080/empleados/activos/mayores-de-50?&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "conFamiliares") {
            url = `http://localhost:8080/empleados/con-familiares-menores?&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        }
        else if (tipoBusqueda === "estadoCivil" && estadoCivilBuscar) {
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
        }
        else if (tipoBusqueda === "familiaresPorGenero" && generoBuscarFamiliares) {
            url = `http://localhost:8080/empleados/conFamiliares/genero?genero=${generoBuscarFamiliares}&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "libretaMilitar" && libretaMilitarBuscar) {
            url = `http://localhost:8080/empleados/libreta-militar?libretaMilitar=${libretaMilitarBuscar}&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "cargo" && cargoBuscar) {
            url = `http://localhost:8080/empleados/por-cargo?cargo=${cargoBuscar}&page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

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

        authFetch(url)
            .then((response) => response.json())
            .then((data) => {
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
            const response = await authFetch(`http://localhost:8080/empleados/${id}`, {
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

        let url = `http://localhost:8080/empleados/${tipo}?${valor}=${valor}`;

        authFetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log("Resultado de la búsqueda:", data);
                setResultadoBusqueda(data.content);
                setTotalPaginas(data.totalPages);
                setPaginaActual(data.number);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);

                //No está activando el mensaje de confirmación		-------------------------

                Swal.fire({
                    icon: "success",
                    title: "Búsqueda completada",
                    text: `Se encontraron ${data.totalElements}`,
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
            authFetch("http://localhost:8080/empleados/sin-contrato")
                .then(res => res.json())
                .then(data => {
                    setResultadoBusqueda(data.content || []);
                })
                .catch(error => {
                    console.error("Error al buscar empleados sin contrato", error);
                });
            return;

        } else if (tipoBusqueda === "estadoCivil") {
            realizarBusquedaFiltrada("estado-civil", estadoCivilBuscar, "Estado civil");
        } else if (tipoBusqueda === "genero") {
            realizarBusquedaFiltrada("genero", generoBuscar, "Género");
        } else if (tipoBusqueda === "familiaresPorGenero") {
            realizarBusquedaFiltrada("familiaresPorGenero", generoBuscarFamiliares, "Familiares por Género");
        } else if (tipoBusqueda === "libretaMilitar") {
            realizarBusquedaFiltrada("libreta-militar", libretaMilitarBuscar, "Libreta Militar");
        } else if (tipoBusqueda === "cargo") {
            realizarBusquedaFiltrada("por-cargo", cargoBuscar, "Cargo");
        }
    };

    const realizarBusqueda = (url) => {
        authFetch(url)
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

    const obtenerTitulo = () => {
        if (tipoBusqueda === "sinContrato") return `PERSONAL SIN CONTRATO (total = ${totalElementos})`;

        if (tipoBusqueda === "personalMayorDe50") {
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO MAYOR DE 50 AÑOS (total = ${totalElementos})`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO MAYOR DE 50 AÑOS (total = ${totalElementos})`;
            return `PERSONAL ACTIVO MAYOR DE 50 AÑOS (total = ${totalElementos})`;
        }
        if (tipoBusqueda === "conFamiliares") {
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO CON HIJOS MENORES DE 12 (total = ${totalElementos} PADRES)`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO CON HIJOS MENORES DE 12 (total = ${totalElementos} PADRES)`;
            return `PERSONAL ACTIVO CON HIJOS MENORES DE 12 (total = ${totalElementos} PADRES)`;
        }
        if (tipoBusqueda === "estadoCivil") {
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO CON ESTADO CIVIL: ${estadoCivilBuscar}(total = ${totalElementos})`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO CON ESTADO CIVIL: ${estadoCivilBuscar} (total = ${totalElementos})`;
            return `PERSONAL ACTIVO CON ESTADO CIVIL: ${estadoCivilBuscar} (total = ${totalElementos})`;
        }
        if (tipoBusqueda === "genero") {
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO POR GÉNERO: ${generoBuscar} (total = ${totalElementos})`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO POR GÉNERO: = ${generoBuscar} (total = ${totalElementos})`;
            return `PERSONAL ACTIVO POR GÉNERO: ${generoBuscar} (total = ${totalElementos})`;
        }
        if (tipoBusqueda === "familiaresPorGenero") {
            const tipoGenero = generoBuscarFamiliares === "MASCULINO"
                ? "PADRES"
                : generoBuscarFamiliares === "FEMENINO"
                    ? "MADRES"
                    : "PADRES Y MADRES";

            if (mostrarAdministrativos)
                return `PERSONAL ADMINISTRATIVO ${tipoGenero} =`;
            if (mostrarOperativos)
                return `PERSONAL OPERATIVO ${tipoGenero} =`;
            return `PERSONAL ACTIVO TOTAL ${tipoGenero} =`;
        }

        if (tipoBusqueda === "libretaMilitar") {
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO CON LIBRETA MILITAR: ${libretaMilitarBuscar} (total = ${totalElementos})`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO CON LIBRETA MILITAR: ${libretaMilitarBuscar} (total = ${totalElementos})`;
            return `PERSONAL ACTIVO CON LIBRETA MILITAR: ${libretaMilitarBuscar} (total = ${totalElementos})`;
        }
        if (tipoBusqueda === "cargo") {
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO CON CARGO: ${cargoBuscar} (total = ${totalElementos})`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO CON CARGO: ${cargoBuscar} (total = ${totalElementos})`;
            return `PERSONAL ACTIVO CON CARGO: ${cargoBuscar} (total = ${totalElementos})`;
        }
        if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO (total = ${totalElementos})`;

        if (mostrarOperativos) return `PERSONAL  OPERATIVO (total = ${totalElementos})`;

        if (mostrarSupervisores) return `SUPERVISORES (total = ${totalElementos})`;

        if (mostrarInactivos) return `PERSONAL RETIRADO (total = ${totalElementos})`;

        return `PERSONAL ACTIVO (Administrativos, Operativos, Supervisores total = ${totalElementos})`;
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
                            <option value="nombre">POR NOMBRE</option>
                            <option value="documento">N° DOCUMENTO</option>
                            <option value="cargo">POR CARGO</option>
                            <option value="personalMayorDe50">MAYORES DE 50 AÑOS</option>
                            <option value="estadoCivil">ESTADO CIVIL</option>
                            <option value="genero">GÉNERO</option>
                            <option value="familiaresPorGenero">PADRES/MADRES</option>
                            <option value="libretaMilitar">LIBRETA MILITAR</option>
                            <option value="conFamiliares">HIJOS/HIJASTROS</option>
                            <option value="cursosPorVencer">CURSOS A VENCER</option>
                            <option value="periodoDePrueba">PERIODO DE PRUEBA</option>
                            <option value="conContrato">CON CONTRATO</option>
                            <option value="sinContrato">SIN CONTRATO</option>
                        </select>
                    </div>

                    {tipoBusqueda !== "estadoCivil" &&
                        tipoBusqueda !== "genero" &&
                        tipoBusqueda !== "familiaresPorGenero" &&
                        tipoBusqueda !== "libretaMilitar" && (
                            <div className="col-md-5">
                                <label className="form-label">
                                    {tipoBusqueda === "nombre" ? "Nombre" :
                                        tipoBusqueda === "cargo" ? "Cargo" : "Documento"}
                                </label>
                                <input
                                    type={tipoBusqueda === "documento" ? "number" : "text"}
                                    value={tipoBusqueda === "nombre" ? nombreBuscar :
                                        tipoBusqueda === "cargo" ? cargoBuscar : documentoBuscar}
                                    onChange={(e) => {
                                        if (tipoBusqueda === "nombre") {
                                            setNombreBuscar(e.target.value);
                                        } else if (tipoBusqueda === "cargo") {
                                            setCargoBuscar(e.target.value);
                                        } else {
                                            setDocumentoBuscar(e.target.value);
                                        }
                                    }}
                                    placeholder={
                                        tipoBusqueda === "nombre" ? "Ingrese el nombre" :
                                            tipoBusqueda === "cargo" ? "Ingrese cargo" : "Ingrese el número de documento"
                                    }
                                    className="form-control"
                                    disabled={["personalMayorDe50",
                                        "conFamiliares",
                                        "cursosPorVencer",
                                        "periodoDePrueba",
                                        "conContrato",
                                        "sinContrato"].includes(tipoBusqueda)}
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

                    {tipoBusqueda === "familiaresPorGenero" && (
                        <div className="col-md-5">
                            <label className="form-label">PADRES/MADRES</label>
                            <select
                                className="form-select"
                                value={generoBuscarFamiliares}
                                onChange={(e) => setGeneroBuscarFamiliares(e.target.value)}
                            >
                                <option value="">Seleccione el género</option>
                                <option value="MASCULINO">MASCULINO</option>
                                <option value="FEMENINO">FEMENINO</option>

                            </select>
                        </div>
                    )}

                    {tipoBusqueda === "libretaMilitar" && (
                        <div className="col-md-5">
                            <label className="form-label">LIBRETA MILITAR</label>
                            <select
                                className="form-select"
                                value={libretaMilitarBuscar}
                                onChange={(e) => setLibretaMilitarBuscar(e.target.value)}
                            >
                                <option value="">SELECCIONE</option>
                                <option value="PRIMERA">PRIMERA CLASE</option>
                                <option value="SEGUNDA">SEGUNDA CLASE</option>
                                <option value="NO_TIENE">NO TIENE</option>

                            </select>
                        </div>
                    )}

                    <div className="col-md-4">
                        <button
                            onClick={manejarBusqueda}
                            className="btn btn-info me-2"
                            disabled={[
                                "estadoCivil",
                                "personalMayorDe50",
                                "genero",
                                "familiaresPorGenero",
                                "libretaMilitar",
                                "cargo",
                                "conFamiliares",
                                "cursosPorVencer",
                                "periodoDePrueba",
                                "conContrato",
                                "sinContrato"]
                                .includes(tipoBusqueda)}
                        >
                            Buscar
                        </button>
                        <button
                            onClick={() => {
                                setTipoBusqueda("nombre");
                                obtenerTitulo("");
                                setPaginaActual(0);
                                setResultadoBusqueda([]);
                                setDocumentoBuscar("");
                                setNombreBuscar("");
                                setCargoBuscar("");
                                setEstadoCivilBuscar("");
                                setGeneroBuscar("");
                                setGeneroBuscarFamiliares("");
                                setLibretaMilitarBuscar("");
                                setMostrarTablaContratos(false);
                                cargarEmpleados(0);
                            }}
                            className="btn btn-secondary"
                        >
                            Limpiar
                        </button>

                    </div>
                </div>
            </div>

            {tipoBusqueda !== "conContrato" &&
                tipoBusqueda !== "conFamiliares" &&
                tipoBusqueda !== "cursosPorVencer" &&
                tipoBusqueda !== "periodoDePrueba" &&
                tipoBusqueda !== "familiaresPorGenero" && (
                    <>
                        <h4 className="alinearTexto">
                            {obtenerTitulo()}
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
                    </>
                )}

            {tipoBusqueda === "conContrato" && (
                <div className="mt-4">
                    <TablaContrato />
                </div>
            )}
            {tipoBusqueda === "conFamiliares" && (
                <div className="mt-4">
                    <TablaFamiliar
                        tipoBusqueda="conFamiliares"
                        tipoEmpleado={
                            mostrarAdministrativos ? "ADMINISTRATIVO" :
                                mostrarOperativos ? "OPERATIVO" : null
                        }
                        titulo={obtenerTitulo()}
                    />
                </div>
            )}

            {tipoBusqueda === "familiaresPorGenero" && (
                <div className="mt-4">
                    <TablaFamiliar
                        tipoBusqueda="familiaresPorGenero"
                        genero={generoBuscarFamiliares || null}  // null = traer todos (padres y madres)
                        tipoEmpleado={
                            mostrarAdministrativos ? "ADMINISTRATIVO" :
                                mostrarOperativos ? "OPERATIVO" : null
                        }
                        titulo={obtenerTitulo()}
                    />
                </div>
            )}

            {tipoBusqueda === "cursosPorVencer" && (
                <div className="mt-4">
                    <TablaCurso />
                </div>
            )}

            {tipoBusqueda === "periodoDePrueba" && (
                <div className="mt-4">
                    <TablaContratoConPeriodoDePrueba />
                </div>
            )}

            {tipoBusqueda !== "conContrato" &&
                tipoBusqueda !== "conFamiliares" &&
                tipoBusqueda !== "cursosPorVencer" &&
                tipoBusqueda !== "periodoDePrueba" &&
                tipoBusqueda !== "familiaresPorGenero" && (
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
            {tipoBusqueda !== "conContrato" &&
                tipoBusqueda !== "conFamiliares" &&
                tipoBusqueda !== "cursosPorVencer" && 
                tipoBusqueda !== "periodoDePrueba" && 
                tipoBusqueda !== "familiaresPorGenero" && (
                    <>
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
                    </>
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

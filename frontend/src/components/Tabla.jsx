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
import ProtectedElement from "../utils/ProtectedElement";
import ExportModal from "./ExportModal";
import * as XLSX from "xlsx";

export function Tabla({
    mostrarInactivos = false,
    mostrarAdministrativos = false,
    mostrarOperativos = false,
    sinContrato = false,
    mostrarSupervisores = false,
}) {

    //Estados para seleccionar empleado mostrar Modal y actualizar
    const [empleados, setEmpleados] = useState([]);
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState([]);
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
    const [edadMax, setEdadMax] = useState(12);

    //Estados para mostrar Modal y exportar a Excel
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [empleadosExport, setEmpleadosExport] = useState([]);

    useEffect(() => {
        cargarEmpleados(paginaActual);
        // eslint-disable-next-line
    }, [mostrarInactivos,
        mostrarAdministrativos,
        mostrarOperativos,
        mostrarSupervisores,
        estadoCivilBuscar,
        generoBuscar,
        edadMax,
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


    // 👉 Función que construye la URL según filtros
    const construirUrlEmpleados = (pagina = 0, exportar = false) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        let baseUrl = `${backendUrl}/empleados`;
        let url;

        if (sinContrato || tipoBusqueda === "sinContrato") {
            url = `${baseUrl}/sin-contrato?page=${pagina}`;
        } else if (tipoBusqueda === "personalMayorDe50") {
            url = `${baseUrl}/activos/mayores-de-50?page=${pagina}`;

            // Agregar filtro por tipo de empleado si está activo
            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "conFamiliares" && edadMax) {
            url = `${baseUrl}/con-familiares-menores?edadMax=${edadMax}&page=${pagina}`;

            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "estadoCivil" && estadoCivilBuscar) {
            url = `${baseUrl}/estado-civil?estadoCivil=${estadoCivilBuscar}&page=${pagina}`;

            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "genero" && generoBuscar) {
            url = `${baseUrl}/genero?genero=${generoBuscar}&page=${pagina}`;

            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "familiaresPorGenero" && generoBuscarFamiliares) {
            url = `${baseUrl}/conFamiliares/genero?genero=${generoBuscarFamiliares}&page=${pagina}`;

            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "libretaMilitar" && libretaMilitarBuscar) {
            url = `${baseUrl}/libreta-militar?libretaMilitar=${libretaMilitarBuscar}&page=${pagina}`;

            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (tipoBusqueda === "cargo" && cargoBuscar) {
            url = `${baseUrl}/por-cargo?cargo=${cargoBuscar}&page=${pagina}`;

            if (mostrarAdministrativos) {
                url += `&tipoEmpleado=ADMINISTRATIVO`;
            } else if (mostrarOperativos) {
                url += `&tipoEmpleado=OPERATIVO`;
            }

        } else if (mostrarAdministrativos) {
            url = `${baseUrl}/administrativos/activos?page=${pagina}`;
        } else if (mostrarOperativos) {
            url = `${baseUrl}/operativos/activos?page=${pagina}`;
        } else if (mostrarSupervisores) {
            url = `${baseUrl}/supervisores/activos?page=${pagina}`;
        } else {
            url = mostrarInactivos
                ? `${baseUrl}/inactivos?page=${pagina}`
                : `${baseUrl}/activos?page=${pagina}`;
        }

        //Si es exportación, agregamos un flag al backend para indicar que es exportación
        if (exportar) {
            if (url.includes("?")) {
                url += "&exportar=true";
            } else {
                url += "?exportar=true";
            }
        }

        return url;
    };

    const cargarEmpleados = (pagina = 0) => {
        const url = construirUrlEmpleados(pagina);

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

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const response = await authFetch(`${backendUrl}/empleados/${id}`, {
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
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        let url = `${backendUrl}/empleados/${tipo}?${valor}=${valor}`;

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
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const url = mostrarInactivos
                ? `${backendUrl}/empleados/buscar/inactivos?filtro=${nombreBuscar}`
                : `${backendUrl}/empleados/buscar/activos?filtro=${nombreBuscar}`;

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
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const url = mostrarInactivos
                ? `${backendUrl}/empleados/buscar/inactivos/documento?numeroDocumento=${documentoBuscar}`
                : `${backendUrl}/empleados/buscar/activos/documento?numeroDocumento=${documentoBuscar}`;

            realizarBusqueda(url);

        }
        if (tipoBusqueda === "sinContrato") {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            authFetch(`${backendUrl}/empleados/sin-contrato`)
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
        } else if (tipoBusqueda === "conFamiliares") {
            realizarBusquedaFiltrada("conFamiliares", edadMax, "Familiares por Edad");
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
            if (mostrarAdministrativos) return `PERSONAL ADMINISTRATIVO CON HIJOS ≤ ${edadMax} AÑOS (total = ${totalElementos} PADRES)`;
            if (mostrarOperativos) return `PERSONAL OPERATIVO CON HIJOS ≤ ${edadMax} AÑOS (total = ${totalElementos} PADRES)`;
            return `PERSONAL ACTIVO CON HIJOS ≤ ${edadMax} AÑOS (total = ${totalElementos} PADRES)`;
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

    const prepararExportacion = async () => {
        try {
            let pagina = 0;
            let empleadosTemp = [];
            let continuar = true;

            while (continuar) {
                const url = construirUrlEmpleados(pagina);
                const response = await authFetch(url);
                if (!response.ok) throw new Error(`Error en la página ${pagina}: ${response.status}`);

                const data = await response.json();
                empleadosTemp = [...empleadosTemp, ...data.content];

                continuar = !data.last;
                pagina++;
            }

            setEmpleadosExport(empleadosTemp); // Guardamos los datos en estado
            setIsModalOpen(true); // Abrimos el modal

        } catch (error) {
            console.error("Error exportando empleados:", error);
        }
    };

    function autoWidth(ws, data) {
        if (!data || data.length === 0) return;

        const colWidths = Object.keys(data[0]).map((key) => ({
            wch: key.length + 2, // espacio adicional para los headers
        }));

        data.forEach((row) => {
            Object.keys(row).forEach((key, i) => {
                const val = row[key] ? row[key].toString() : "";
                const len = val.length + 2; // +2 para que no quede tan justo
                if (len > colWidths[i].wch) {
                    colWidths[i].wch = len;
                }
            });
        });

        ws["!cols"] = colWidths;
    }

    const exportarEmpleadoIndividual = async (emp) => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const response = await authFetch(`${backendUrl}/empleados/${emp.id}/completo`);
            if (!response.ok) {
                throw new Error("Error al obtener datos completos del empleado");
            }

            const datos = await response.json();

            const wb = XLSX.utils.book_new();

            // Hoja principal
            const hojaEmpleado = XLSX.utils.json_to_sheet([datos.empleado]);
            autoWidth(hojaEmpleado, [datos.empleado]);
            XLSX.utils.book_append_sheet(wb, hojaEmpleado, "Empleado");

            if (datos.contrato?.length > 0) {
                const contratosLimpios = datos.contrato.map(c => ({
                    "Contrato": c.numeroContrato,
                    "Fecha de Ingreso": c.fechaIngreso,
                    "Fecha de Retiro": c.fechaRetiro,
                    "Fecha de Renuncia": c.fechaRenuncia,
                    "Otro Si": c.fechaOtroSi,
                    "Omiso": c.omiso,
                    "Continua": c.continua,
                    "Terminación de Contrato Desde": c.vacacionesDesde,
                    "Terminación de Contrato Hasta": c.vacacionesHasta
                }));
                const hojaContratos = XLSX.utils.json_to_sheet(contratosLimpios);
                autoWidth(hojaContratos, contratosLimpios);
                XLSX.utils.book_append_sheet(wb, hojaContratos, "Contratos");
            }

            if (datos.familiar?.length > 0) {
                const familiaresLimpios = datos.familiar.map(f => ({
                    "Tipo de Familiar": f.tipoFamiliar,
                    "Nombre": f.nombreFamiliar,
                    "Edad": f.edadFamiliar
                }));
                const hojaFamiliares = XLSX.utils.json_to_sheet(familiaresLimpios);
                autoWidth(hojaFamiliares, familiaresLimpios);
                XLSX.utils.book_append_sheet(wb, hojaFamiliares, "Familiares");
            }
            if (datos.curso?.length > 0) {
                const cursosLimpios = datos.curso.map(cu => ({
                    "Tipo de Curso": cu.tipoCurso,
                    "Especialidad": cu.categoria,
                    "Fecha del Curso": cu.fechaCurso,
                    "Función Específica": cu.funcionEspecifica
                }));
                const hojaCursos = XLSX.utils.json_to_sheet(cursosLimpios);
                autoWidth(hojaCursos, cursosLimpios);
                XLSX.utils.book_append_sheet(wb, hojaCursos, "Cursos");
            }
            if (datos.estudio?.length > 0) {
                const estudiosLimpios = datos.estudio.map(es => ({
                    "Tipo de Estudio": es.tipoEstudio,
                    "Título": es.nombreEstudio,
                    "Fecha de Realización": es.fechaEstudio
                }));
                const hojaEstudios = XLSX.utils.json_to_sheet(estudiosLimpios);
                autoWidth(hojaEstudios, estudiosLimpios);
                XLSX.utils.book_append_sheet(wb, hojaEstudios, "Estudios");
            }
            if (datos.experienciaLaboral?.length > 0) {
                const experienciaLimpio = datos.experienciaLaboral.map(ex => ({
                    "Descripción": ex.descripcionExperiencia
                }));
                const hojaExperiencia = XLSX.utils.json_to_sheet(experienciaLimpio);
                autoWidth(hojaExperiencia, experienciaLimpio);
                XLSX.utils.book_append_sheet(wb, hojaExperiencia, "Experiencia");
            }
            if (datos.afiliacion?.length > 0) {
                const afiliacionLimpia = datos.afiliacion.map(af => ({
                    "Tipo de Afiliación": af.tipoAfiliacion,
                    "Entidad": af.nombreEntidad,
                    "Fecha de Afiliación": af.fechaAfiliacion
                }));
                const hojaAfiliaciones = XLSX.utils.json_to_sheet(afiliacionLimpia);
                autoWidth(hojaAfiliaciones, afiliacionLimpia);
                XLSX.utils.book_append_sheet(wb, hojaAfiliaciones, "Afiliaciones");
            }
            if (datos.otroDocumento?.length > 0) {
                const documentosLimpios = datos.otroDocumento.map(d => ({
                    "Tipo de Documento": d.tipoOtroDocumento,
                    "Descripción": d.descripcionDocumento,
                    "Fecha de Registro": d.fechaRegistro
                }));
                const hojaDocumentos = XLSX.utils.json_to_sheet(documentosLimpios);
                autoWidth(hojaDocumentos, documentosLimpios);
                XLSX.utils.book_append_sheet(wb, hojaDocumentos, "Documentos");
            }
            if (datos.vehiculo?.length > 0) {
                const vehiculosLimpios = datos.vehiculo.map(v => ({
                    "Tipo de Vehículo": v.tipoVehiculo,
                    "Tecnomecánico": v.tecnomecanico,
                    "Soat": v.soat,
                    "Licencia": v.licencia,
                    "Placa": v.placa
                }));
                const hojaVehiculos = XLSX.utils.json_to_sheet(vehiculosLimpios);
                autoWidth(hojaVehiculos, vehiculosLimpios);
                XLSX.utils.book_append_sheet(wb, hojaVehiculos, "Vehiculos");
            }

            XLSX.writeFile(wb, `Empleado_${emp.nombres}_${emp.apellidos}.xlsx`);
        } catch (error) {
            console.error("Error exportando empleado:", error);
            alert("No se pudo exportar el empleado");
        }
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
                        tipoBusqueda !== "conFamiliares" &&
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
                                        "cursosPorVencer",
                                        "periodoDePrueba", 
                                        "conContrato",
                                        "sinContrato"].includes(tipoBusqueda)}
                                />
                            </div>
                        )}

                    {tipoBusqueda === "conFamiliares" && (
                        <div className="col-md-5">
                            <label className="form-label">Edad máxima</label>
                            <input
                                type="number"
                                value={edadMax}
                                onChange={(e) => setEdadMax(e.target.value)}
                                placeholder="Ingrese edad máxima"
                                className="form-control"
                                min="1"
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
                                "conFamiliares", 
                                "familiaresPorGenero",
                                "libretaMilitar",
                                "cargo",
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
                                setEdadMax("");
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
                        <div>
                            <h4 className="alinearTexto">
                                {obtenerTitulo()}
                            </h4>

                            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                                <div className="row align-items-center mb-1">
                                    <div className="col text-start"></div> {/* espacio vacío para balancear */}
                                    <div className="col text-center">
                                        <Paginacion
                                            paginaActual={paginaActual}
                                            totalPaginas={totalPaginas}
                                            onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                                        />
                                    </div>
                                    <div className="col text-end d-flex align-items-center justify-content-end">
                                        <button
                                            className="btn btn-success"
                                            onClick={prepararExportacion}
                                        >
                                            Exportar a Excel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(resultadoBusqueda === null || resultadoBusqueda.length === 0) && (
                                <div className="mt-2 text-center">
                                    <small>
                                        Mostrando página {paginaActual + 1} de {totalPaginas} —{" "}
                                        {tamanoPagina} por página, total de registros: {totalElementos}
                                    </small>
                                </div>
                            )}
                        </div>
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
                        edadMax={edadMax}
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
                        edadMax={edadMax}
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

            <ExportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                datos={empleadosExport}
                tituloExportacion={
                    empleadosExport.length === 1
                        ? `Empleado_${empleadosExport[0].nombres}_${empleadosExport[0].apellidos}`
                        : obtenerTitulo()
                }
            />

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
                                                    {console.log('Emp actual:', emp, 'Rol:', localStorage.getItem("rol"))}

                                                    <ProtectedElement allowedRoles={["RRHH"]}>
                                                        <button
                                                            onClick={() => {
                                                                console.log('Click en botón, emp:', emp);
                                                                setEmpleadoSeleccionado(emp);
                                                                setMostrarModal(true);
                                                            }}
                                                            className="btn btn-sm btn-outline-primary me-0"
                                                            title="Editar"
                                                        >
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </button>
                                                    </ProtectedElement>
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
                                                    <button
                                                        onClick={() => exportarEmpleadoIndividual(emp)}
                                                        className="btn btn-sm btn-outline-success me-0"
                                                        title="Exportar empleado"
                                                    >
                                                        <i className="bi bi-file-earmark-excel"></i>
                                                    </button>
                                                    {!mostrarInactivos && (

                                                        <ProtectedElement allowedRoles={["RRHH"]}>
                                                            <button
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Estás seguro?',
                                                                        text: "Esta acción desactivará al empleado.",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, desactivar',
                                                                        cancelButtonText: 'Cancelar'
                                                                    }).then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            eliminarEmpleado(emp.id);
                                                                            Swal.fire(
                                                                                'Eliminado',
                                                                                'El empleado ha sido retirado.',
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
                                                        </ProtectedElement>
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

                                                    <ProtectedElement allowedRoles={["RRHH"]}>
                                                        <button
                                                            onClick={() => {
                                                                setEmpleadoSeleccionado(emp);
                                                                setMostrarModal(true);
                                                            }}
                                                            className="btn btn-sm btn-outline-primary me-0"
                                                            title="Editar"
                                                        >
                                                            <i className="bi bi-pencil-fill"></i>
                                                        </button>
                                                    </ProtectedElement>


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

                                                    <button
                                                        onClick={() => exportarEmpleadoIndividual(emp)}
                                                        className="btn btn-sm btn-outline-success me-0"
                                                        title="Exportar empleado"
                                                    >
                                                        <i className="bi bi-file-earmark-excel"></i>
                                                    </button>

                                                    {!mostrarInactivos && tipoBusqueda !== "sinContrato" && (

                                                        <ProtectedElement allowedRoles={["RRHH"]}>
                                                            <button
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: '¿Estás seguro?',
                                                                        text: "Esta acción desactivará al empleado.",
                                                                        icon: 'warning',
                                                                        showCancelButton: true,
                                                                        confirmButtonColor: '#3085d6',
                                                                        cancelButtonColor: '#d33',
                                                                        confirmButtonText: 'Sí, desactivar',
                                                                        cancelButtonText: 'Cancelar'
                                                                    }).then((result) => {
                                                                        if (result.isConfirmed) {
                                                                            eliminarEmpleado(emp.id);
                                                                            Swal.fire(
                                                                                'Desactivado',
                                                                                'El empleado ha sido retirado.',
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
                                                        </ProtectedElement>

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

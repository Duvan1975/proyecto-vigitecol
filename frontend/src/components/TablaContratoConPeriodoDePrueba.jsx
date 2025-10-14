import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import Paginacion from "./Paginacion";
import * as XLSX from "xlsx";

export function TablaContratoConPeriodoDePrueba() {
    const [empleadosConPeriodoDePrueba, setEmpleadosConPeriodoDePrueba] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEmpleadosConPeriodoDePrueba(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarEmpleadosConPeriodoDePrueba = (pagina = 0) => {
        setCargando(true);

        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/empleados/periodo-prueba/vencido?page=${pagina}`, {
            headers: {},
        })
            .then((res) => res.json())
            .then((data) => {
                setEmpleadosConPeriodoDePrueba(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar empleados en periodo de prueba:", error);
                setCargando(false);
            });
    };

    // Exportar TODOS los registros a Excel con filtros en las columnas
    const exportarExcel = () => {
        setCargando(true);

        // Traemos TODOS los registros
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/empleados/periodo-prueba/vencido?page=0&size=10000`, {
            headers: {},
        })
            .then((res) => res.json())
            .then((data) => {
                const empleados = data.content;

                // Preparamos encabezados
                const headers = [
                    "Nombres",
                    "Apellidos",
                    "Documento",
                    "Teléfono",
                    "Cargo",
                    "Días Restantes",
                    "Fecha de Ingreso"
                ];

                // Preparamos datos
                const datosExportar = empleados.flatMap((empleado) =>
                    empleado.contratoPeriodoDePrueba.map((contrato) => [
                        empleado.nombres,
                        empleado.apellidos,
                        empleado.numeroDocumento,
                        empleado.telefono,
                        empleado.cargo,
                        contrato.diasRestantesPeriodoPrueba,
                        contrato.fechaIngreso
                    ])
                );

                // Creamos la hoja de Excel
                const worksheet = XLSX.utils.aoa_to_sheet([headers, ...datosExportar]);

                // Agregar autofiltro
                worksheet['!autofilter'] = { ref: "A1:G1" }; // rango desde A1 hasta la última columna

                const ajustarColumnas = [headers, ...datosExportar];
                const colWidths = headers.map((_, i) => ({
                    wch: Math.max(
                        ...ajustarColumnas.map(row => (row[i] ? row[i].toString().length : 0))
                    ) + 2 // +2 para un poco de espacio extra
                }));
                worksheet['!cols'] = colWidths;

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Periodo de Prueba");

                // Descargamos el archivo
                XLSX.writeFile(workbook, `PERSONAL EN PERIODO DE PRUEBA (total = ${totalElementos}).xlsx`);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al exportar Excel:", error);
                setCargando(false);
            });
    };

    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    if (empleadosConPeriodoDePrueba.length === 0) {
        return <p className="text-center text-muted">No hay empleados en periodo de prueba a vencer.</p>;
    }

    return (
        <div>
            <h4 className="alinearTexto">PERSONAL EN PERIODO DE PRUEBA (total = {totalElementos})</h4>

            <div className="row align-items-center mb-1">
                <div className="col text-start"></div> {/* espacio vacío para balancear */}
                <div className="col text-center">
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                    />
                </div>
                <div className="col text-end">
                    <button className="btn btn-success" onClick={exportarExcel}>
                        Exportar a Excel
                    </button>
                </div>
            </div>

            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por página,
                    total de registros: {totalElementos}
                </small>
            </div>

            <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Número Documento</th>
                        <th>Teléfono</th>
                        <th>Cargo</th>
                        <th>Días Restantes</th>
                        <th>Fecha de Ingreso</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosConPeriodoDePrueba.map((empleado) =>
                        empleado.contratoPeriodoDePrueba.map((contrato, index) => (
                            <tr key={`${empleado.id}-${index}`}>
                                <td>{empleado.nombres}</td>
                                <td>{empleado.apellidos}</td>
                                <td>{empleado.numeroDocumento}</td>
                                <td>{empleado.telefono}</td>
                                <td>{empleado.cargo}</td>
                                <td>{contrato.diasRestantesPeriodoPrueba}</td>
                                <td>{contrato.fechaIngreso}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />
            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por página,
                    total de registros: {totalElementos}
                </small>
            </div>
        </div>
    )
}

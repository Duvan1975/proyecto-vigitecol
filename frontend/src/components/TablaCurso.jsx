import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";
import { authFetch } from "../utils/authFetch";
import * as XLSX from "xlsx";

export function TablaCurso() {
    const [empleadosConCursosPorVencer, setEmpleadosConCursosPorVencer] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEmpleadosConCursosPorVencer(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarEmpleadosConCursosPorVencer = (pagina = 0) => {
        setCargando(true);

        authFetch(`http://localhost:8080/empleados/con-cursos/por-vencer?page=${pagina}`, {
            headers: {},
        })
            .then((res) => res.json())
            .then((data) => {
                setEmpleadosConCursosPorVencer(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar empleados con cursos:", error);
                setCargando(false);
            });
    };

    // Exportar TODOS los registros a Excel con filtros
    const exportarExcel = () => {
        setCargando(true);

        authFetch(`http://localhost:8080/empleados/con-cursos/por-vencer?page=0&size=10000`, {
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
                    "Tipo Curso",
                    "Categoría",
                    "Fecha de Realización",
                    "Vencido"
                ];

                // Preparamos datos (un registro por cada curso)
                const datosExportar = empleados.flatMap((empleado) =>
                    empleado.cursosVigentes.map((curso) => [
                        empleado.nombres,
                        empleado.apellidos,
                        empleado.numeroDocumento,
                        empleado.telefono,
                        empleado.cargo,
                        curso.tipoCurso,
                        curso.categoria,
                        curso.fechaCurso,
                        curso.vencido ? "Sí" : "No"
                    ])
                );

                // Creamos la hoja
                const worksheet = XLSX.utils.aoa_to_sheet([headers, ...datosExportar]);

                // Agregar autofiltro
                worksheet['!autofilter'] = { ref: "A1:I1" };

                // Ajustar ancho de columnas
                const ajustarColumnas = [headers, ...datosExportar];
                const colWidths = headers.map((_, i) => ({
                    wch: Math.max(
                        ...ajustarColumnas.map(row => (row[i] ? row[i].toString().length : 0))
                    ) + 2
                }));
                worksheet['!cols'] = colWidths;

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Cursos por Vencer");

                // Descargar archivo
                XLSX.writeFile(workbook, `PERSONAL_CON_CURSOS_POR_VENCER (total = ${totalElementos}).xlsx`);
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

    if (empleadosConCursosPorVencer.length === 0) {
        return <p className="text-center text-muted">No hay empleados con cursos por vencer.</p>;
    }

    return (
        <div>
            <h4 className="alinearTexto">PERSONAL OPERATIVO CON CURSOS POR VENCER O VENCIDOS (total = {totalElementos})</h4>

            <div className="row align-items-center mb-1">
                <div className="col text-start"></div> {/* espacio vacío */}
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
                        <th>Curso Próximo a Vencer</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosConCursosPorVencer
                        .filter((empleado) => empleado.cursosVigentes.length > 0)
                        .map((empleado) => (
                            <tr key={empleado.id} className={empleado.cursosVigentes.some(c => c.vencido) ? "table-danger" : ""}>
                                <td>{empleado.nombres}</td>
                                <td>{empleado.apellidos}</td>
                                <td>{empleado.numeroDocumento}</td>
                                <td>{empleado.telefono}</td>
                                <td>{empleado.cargo}</td>
                                <td>
                                    <ul className="mb-0 ps-3">
                                        {empleado.cursosVigentes.map((curso, index) => (
                                            <li key={index} className={curso.vencido ? "text-danger" : "text-success"}>
                                                <strong>{curso.tipoCurso}</strong> — {curso.categoria}
                                                <br />
                                                <small>Fecha de Realización: <strong>{curso.fechaCurso}</strong></small>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
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
    );
}

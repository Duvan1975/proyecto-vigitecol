import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import Paginacion from "./Paginacion";
import * as XLSX from "xlsx";

export function TablaContratosPorVencer() {

    const [contratosPorVencer, setContratosPorVencer] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarContratosPorVencer(paginaActual);

        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarContratosPorVencer = (pagina = 0) => {

        setCargando(true);

        const backendUrl =
            process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

        authFetch(
            `${backendUrl}/empleados/contratos/por-vencer?page=${pagina}`,
            {
                headers: {},
            }
        )
            .then((res) => res.json())
            .then((data) => {

                setContratosPorVencer(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);

                setCargando(false);
            })
            .catch((error) => {

                console.error(
                    "Error al cargar contratos por vencer:",
                    error
                );

                setCargando(false);
            });
    };

    // EXPORTAR EXCEL
    const exportarExcel = () => {

        setCargando(true);

        const backendUrl =
            process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

        authFetch(
            `${backendUrl}/empleados/contratos/por-vencer?page=0&size=10000`,
            {
                headers: {},
            }
        )
            .then((res) => res.json())
            .then((data) => {

                const empleados = data.content;

                const headers = [
                    "Nombres",
                    "Apellidos",
                    "Documento",
                    "Teléfono",
                    "Cargo",
                    "Contrato N°",
                    "Fecha Ingreso",
                    "Fecha Retiro",
                    "Días Restantes"
                ];

                const datosExportar = empleados.flatMap((empleado) =>
                    empleado.contratosPorVencer.map((contrato) => [
                        empleado.nombres,
                        empleado.apellidos,
                        empleado.numeroDocumento,
                        empleado.telefono,
                        empleado.cargo,
                        contrato.numeroContrato,
                        contrato.fechaIngreso,
                        contrato.fechaRetiro,
                        contrato.diasRestantes
                    ])
                );

                const worksheet =
                    XLSX.utils.aoa_to_sheet([
                        headers,
                        ...datosExportar
                    ]);

                worksheet['!autofilter'] = {
                    ref: "A1:I1"
                };

                const ajustarColumnas = [
                    headers,
                    ...datosExportar
                ];

                const colWidths = headers.map((_, i) => ({
                    wch: Math.max(
                        ...ajustarColumnas.map(row =>
                            row[i]
                                ? row[i].toString().length
                                : 0
                        )
                    ) + 2
                }));

                worksheet['!cols'] = colWidths;

                const workbook = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(
                    workbook,
                    worksheet,
                    "Contratos Por Vencer"
                );

                XLSX.writeFile(
                    workbook,
                    `CONTRATOS POR VENCER (total = ${totalElementos}).xlsx`
                );

                setCargando(false);
            })
            .catch((error) => {

                console.error(
                    "Error al exportar Excel:",
                    error
                );

                setCargando(false);
            });
    };

    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    if (contratosPorVencer.length === 0) {

        return (
            <p className="text-center text-muted">
                No hay contratos por vencer.
            </p>
        );
    }

    return (

        <div>

            <h4 className="alinearTexto">
                CONTRATOS POR VENCER
                (total = {totalElementos})
            </h4>

            <div className="row align-items-center mb-1">

                <div className="col text-start"></div>

                <div className="col text-center">
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onChange={(nuevaPagina) =>
                            setPaginaActual(nuevaPagina)
                        }
                    />
                </div>

                <div className="col text-end">
                    <button
                        className="btn btn-success"
                        onClick={exportarExcel}
                    >
                        Exportar a Excel
                    </button>
                </div>

            </div>

            <div className="mt-2 text-center">

                <small>
                    Mostrando página {paginaActual + 1}
                    de {totalPaginas}
                    — {tamanoPagina} por página,
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
                        <th>Contrato N°</th>
                        <th>Fecha Ingreso</th>
                        <th>Fecha Retiro</th>
                        <th>Días Restantes</th>
                    </tr>

                </thead>

                <tbody>
                    {contratosPorVencer.map((empleado) =>
                        empleado.contratosPorVencer.map(
                            (contrato, index) => (
                                <tr key={`${empleado.id}-${index}`}>
                                    <td>{empleado.nombres}</td>
                                    <td>{empleado.apellidos}</td>
                                    <td>{empleado.numeroDocumento}</td>
                                    <td>{empleado.telefono}</td>
                                    <td>{empleado.cargo}</td>
                                    <td>{contrato.numeroContrato}</td>
                                    <td>{contrato.fechaIngreso}</td>
                                    <td>{contrato.fechaRetiro}</td>
                                    <td>{contrato.diasRestantes}</td>
                                </tr>
                            )
                        )
                    )}
                </tbody>
            </table>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) =>
                    setPaginaActual(nuevaPagina)
                }
            />

            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1}
                    de {totalPaginas}
                    — {tamanoPagina} por página,
                    total de registros: {totalElementos}
                </small>
            </div>
        </div>
    );
}
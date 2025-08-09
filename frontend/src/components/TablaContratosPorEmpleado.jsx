import { useEffect, useState } from "react";
import { exportarAExcel } from "../utils/exportarExcel";

export function TablaContratosPorEmpleado({ empleadoId, actualizar, onClose }) {
    const [contratos, setContratos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [nombreEmpleado, setNombreEmpleado] = useState("");

    useEffect(() => {
        cargarContratosPorEmpleado();
        // eslint-disable-next-line
    }, [empleadoId, actualizar]);

    const cargarContratosPorEmpleado = () => {
        setCargando(true);
        fetch(`http://localhost:8080/contratos/por-empleado/${empleadoId}`)
            .then((res) => res.json())
            .then((data) => {
                setContratos(data);
                if (data.length > 0) {
                    const nombreCompleto = `${data[0].nombreEmpleado} ${data[0].apellidoEmpleado}`;
                    setNombreEmpleado(nombreCompleto);
                } else {
                    setNombreEmpleado("");
                }
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar contratos:", error);
                setCargando(false);
            });
    };

    const exportarExcel = () => {
        const datosExportar = contratos.map(contrato => ({
            "Contrato N°": contrato.numeroContrato,
            "Fecha Ingreso": contrato.fechaIngreso,
            "Fecha Retiro": contrato.fechaRetiro || "—",
            "Fecha Renuncia": contrato.fechaRenuncia || "—",
            "Fecha Otro Sí": contrato.fechaOtroSi || "—",
            "Omiso": contrato.omiso,
            "¿Continúa?": contrato.continua ? "Sí" : "No",
            "Vacaciones Desde": contrato.vacacionesDesde || "—",
            "Vacaciones Hasta": contrato.vacacionesHasta || "—"
        }));

        // Nombre del archivo
        const nombreArchivo = `Contratos_${nombreEmpleado.replace(/\s+/g, '_')}`;

        // Llama a la función de exportación
        exportarAExcel(datosExportar, nombreArchivo);
        // Función auxiliar para formatear fechas

    };

    if (cargando) return <p>Cargando historial...</p>;

    if (contratos.length === 0) {
        return <p className="text-center text-muted">Este empleado no tiene contratos registrados.</p>;
    }

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0 alinearTexto">Historial de Contratos {nombreEmpleado && `de ${nombreEmpleado}`}</h4>
                <div>
                    <button
                        className="btn btn-success me-2"
                        onClick={exportarExcel}
                        title="Exportar a Excel"
                    >
                        <i className="bi bi-file-excel"></i> Exportar
                    </button>
                    <button className="btn btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>

            <table className="table table-bordered border-primary table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Contrato N°</th>
                        <th>Fecha Ingreso</th>
                        <th>Fecha Retiro</th>
                        <th>Fecha Renuncia</th>
                        <th>Fecha OTRO Sí</th>
                        <th>Omiso</th>
                        <th>¿Continúa?</th>
                        <th>Vacaciones Desde</th>
                        <th>Vacaciones Hasta</th>
                    </tr>
                </thead>
                <tbody>
                    {contratos.map((contrato) => (
                        <tr key={contrato.contratoId}>
                            <td>{contrato.numeroContrato}</td>
                            <td>{contrato.fechaIngreso}</td>
                            <td>{contrato.fechaRetiro || "—"}</td>
                            <td>{contrato.fechaRenuncia || "—"}</td>
                            <td>{contrato.fechaOtroSi || "—"}</td>
                            <td>{contrato.omiso}</td>
                            <td>{contrato.continua ? "Sí" : "No"}</td>
                            <td>{contrato.vacacionesDesde || "—"}</td>
                            <td>{contrato.vacacionesHasta || "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
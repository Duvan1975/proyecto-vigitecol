import { useEffect, useState } from "react";

export function TablaContratosPorEmpleado({ empleadoId, actualizar, onClose }) {
    const [contratos, setContratos] = useState([]);
    const [cargando, setCargando] = useState(true);

    const [nombreEmpleado, setNombreEmpleado] = useState("");

    useEffect(() => {
        cargarContratosPorEmpleado();
        // eslint-disable-next-line
    }, [empleadoId, actualizar]); // Se recarga si el ID o el contador cambian

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
                    setNombreEmpleado(""); // Por si no hay contratos
                }
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar contratos:", error);
                setCargando(false);
            });
    };

    if (cargando) return <p>Cargando historial...</p>;

    if (contratos.length === 0) {
        return <p className="text-center text-muted">Este empleado no tiene contratos registrados.</p>;
    }

    return (
        <div className="mt-4">
            <h4 className="mb-3">Historial de Contratos {nombreEmpleado && `de ${nombreEmpleado}`}</h4>
      
            <button className="btn btn-secondary mb-2" onClick={onClose}>Cerrar</button>
            
            <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Contrato N°</th>
                        <th>Fecha Ingreso</th>
                        <th>Fecha Retiro</th>
                        <th>Fecha Renuncia</th>
                        <th>Fecha Otro Sí</th>
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

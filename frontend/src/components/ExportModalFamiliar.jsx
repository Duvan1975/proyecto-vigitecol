import React, { useState } from "react";
import { exportarAExcel } from "../utils/exportarExcel";

const ExportModalFamiliar = ({
    isOpen,
    onClose,
    tituloExportacion,
    cargarTodasLasPaginas, // siempre lo usaremos
    totalElementos
}) => {
    const [columnasSeleccionadas, setColumnasSeleccionadas] = useState({
        nombres: true,
        apellidos: true,
        numeroDocumento: true,
        edad: true,
        telefono: true,
        correo: true,
        cargo: true,
        numeroDeFamiliares: true,
        familiares: true,
    });

    const [exportando, setExportando] = useState(false);

    if (!isOpen) return null;

    const handleCheckboxChange = (columna) => {
        setColumnasSeleccionadas((prev) => ({
            ...prev,
            [columna]: !prev[columna],
        }));
    };

    const handleExport = async () => {
        setExportando(true);

        try {
            // SIEMPRE exportamos todas las páginas
            const datosAExportar = await cargarTodasLasPaginas();

            if (!datosAExportar || datosAExportar.length === 0) {
                alert("No hay datos válidos para exportar");
                setExportando(false);
                return;
            }

            const datosFiltrados = datosAExportar.map((emp) => {
                const filtrado = {};
                if (columnasSeleccionadas.nombres) filtrado["Nombres"] = emp.nombres || "";
                if (columnasSeleccionadas.apellidos) filtrado["Apellidos"] = emp.apellidos || "";
                if (columnasSeleccionadas.numeroDocumento) filtrado["Documento"] = emp.numeroDocumento || "";
                if (columnasSeleccionadas.edad) filtrado["Edad"] = emp.edad || "";
                if (columnasSeleccionadas.telefono) filtrado["Teléfono"] = emp.telefono || "";
                if (columnasSeleccionadas.correo) filtrado["Correo"] = emp.correo || "";
                if (columnasSeleccionadas.cargo) filtrado["Cargo"] = emp.cargo || "";
                if (columnasSeleccionadas.numeroDeFamiliares) filtrado["Cantidad"] = emp.numeroDeFamiliares || 0;

                if (columnasSeleccionadas.familiares) {
                    const familiares = Array.isArray(emp.familiares) ? emp.familiares : [];
                    filtrado["Familiares"] = familiares
                        .map(f => `• ${f.tipoFamiliar}: ${f.nombreFamiliar} (${f.edadFamiliar} años)`)
                        .join("\n");

                }

                return filtrado;
            });

            exportarAExcel(datosFiltrados, `${tituloExportacion} `);

        } catch (error) {
            console.error("Error al exportar:", error);
            alert("Error al exportar los datos: " + error.message);
        } finally {
            setExportando(false);
            onClose();
        }
    };

    return (
        <div className={`modal fade ${isOpen ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Exportar TODOS los Empleados con Familiares</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>
                            Se exportarán <strong>todos los registros</strong> encontrados
                            ({totalElementos} en total).
                        </p>
                        <p>Selecciona las columnas que deseas exportar:</p>
                        <div className="row">
                            {Object.keys(columnasSeleccionadas).map((col) => (
                                <div className="col-md-4" key={col}>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={columnasSeleccionadas[col]}
                                            onChange={() => handleCheckboxChange(col)}
                                            id={`chk-${col}`}
                                        />
                                        <label className="form-check-label" htmlFor={`chk-${col}`}>
                                            {col.charAt(0).toUpperCase() + col.slice(1)}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose} disabled={exportando}>
                            Cancelar
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={handleExport}
                            disabled={exportando}
                        >
                            {exportando ? "⏳ Exportando..." : "📥 Exportar TODO"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModalFamiliar;

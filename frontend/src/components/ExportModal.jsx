import React, { useState } from "react";
import { exportarAExcel } from "../utils/exportarExcel";

const ExportModal = ({ 
    isOpen, 
    onClose, 
    datos, 
    tituloExportacion,
    totalElementos // nuevo prop
}) => {
    const [columnasSeleccionadas, setColumnasSeleccionadas] = useState({
        nombres: true,
        apellidos: true,
        tipoDocumento: true,
        numeroDocumento: true,
        fechaNacimiento: true,
        lugarNacimiento: true,
        ciudadExpedicion: true,
        edad: true,
        libretaMilitar: true,
        estadoCivil: true,
        genero: true,
        direccion: true,
        telefono: true,
        correo: true,
        tipoEmpleado: true,
        cargo: true,
    });

    const [exportando, setExportando] = useState(false);

    const handleExport = async () => {
        if (!datos || !Array.isArray(datos) || datos.length === 0) {
            alert("No hay datos válidos para exportar");
            return;
        }

        setExportando(true);

        try {
            const datosFiltrados = datos.map((emp) => {
                const filtrado = {};
                if (columnasSeleccionadas.nombres) filtrado["Nombres"] = emp.nombres || "";
                if (columnasSeleccionadas.apellidos) filtrado["Apellidos"] = emp.apellidos || "";
                if (columnasSeleccionadas.tipoDocumento) filtrado["Tipo Documento"] = emp.tipoDocumento || "";
                if (columnasSeleccionadas.numeroDocumento) filtrado["Documento"] = emp.numeroDocumento || "";
                if (columnasSeleccionadas.fechaNacimiento) filtrado["Fecha de Nacimiento"] = emp.fechaNacimiento || "";
                if (columnasSeleccionadas.lugarNacimiento) filtrado["Lugar de Nacimiento"] = emp.lugarNacimiento || "";
                if (columnasSeleccionadas.ciudadExpedicion) filtrado["Ciudad de Expedición"] = emp.ciudadExpedicion || "";
                if (columnasSeleccionadas.edad) filtrado["Edad"] = emp.edad || "";
                if (columnasSeleccionadas.libretaMilitar) filtrado["Libreta Militar"] = emp.libretaMilitar || "";
                if (columnasSeleccionadas.estadoCivil) filtrado["Estado Civil"] = emp.estadoCivil || "";
                if (columnasSeleccionadas.genero) filtrado["Género"] = emp.genero || "";
                if (columnasSeleccionadas.direccion) filtrado["Dirección"] = emp.direccion || "";
                if (columnasSeleccionadas.telefono) filtrado["Teléfono"] = emp.telefono || "";
                if (columnasSeleccionadas.correo) filtrado["Correo"] = emp.correo || "";
                if (columnasSeleccionadas.tipoEmpleado) filtrado["Tipo Empleado"] = emp.tipoEmpleado || "";
                if (columnasSeleccionadas.cargo) filtrado["Cargo"] = emp.cargo || "";
                return filtrado;
            });

            exportarAExcel(datosFiltrados, tituloExportacion || "Empleados_Personalizado");
        } catch (error) {
            console.error("Error al exportar:", error);
            alert("Error al exportar los datos: " + error.message);
        } finally {
            setExportando(false);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal fade ${isOpen ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">📊 {tituloExportacion}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {totalElementos && (
                            <p>
                                Se exportarán <strong>{datos.length === 1 ? "1 registro" : `${totalElementos} registros`}</strong>.
                            </p>
                        )}
                        <p>Selecciona las columnas que deseas exportar:</p>
                        <div className="row">
                            {Object.keys(columnasSeleccionadas).map((col) => (
                                <div className="col-md-4" key={col}>
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={columnasSeleccionadas[col]}
                                            onChange={(e) =>
                                                setColumnasSeleccionadas({
                                                    ...columnasSeleccionadas,
                                                    [col]: e.target.checked,
                                                })
                                            }
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
                            className="btn btn-success" 
                            onClick={handleExport} 
                            disabled={exportando}
                        >
                            {exportando ? "⏳ Exportando..." : "📥 Exportar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;

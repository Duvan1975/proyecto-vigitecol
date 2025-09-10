import React, { useState } from "react";
import { exportarAExcel } from "../utils/exportarExcel";

const ExportModal = ({ isOpen, onClose, datos, tituloExportacion }) => {
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

    const handleExport = () => {
        if (!datos || !Array.isArray(datos) || datos.length === 0) {
            alert("No hay datos válidos para exportar");
            return;
        }

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
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">📊 Exportar a Excel</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <h6>Selecciona las columnas a exportar:</h6>
                        {Object.keys(columnasSeleccionadas).map((columna) => (
                            <div key={columna} className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={columnasSeleccionadas[columna]}
                                    onChange={(e) =>
                                        setColumnasSeleccionadas({
                                            ...columnasSeleccionadas,
                                            [columna]: e.target.checked,
                                        })
                                    }
                                />
                                <label className="form-check-label">
                                    {columna.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="button" className="btn btn-success" onClick={handleExport}>
                            📥 Exportar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;

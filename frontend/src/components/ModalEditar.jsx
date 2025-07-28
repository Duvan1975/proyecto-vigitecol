import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function ModalEditar({ empleado, visible, onClose, onActualizado }) {

    //Estado para cargar contratos
    const [contratos, setContratos] = useState([]);
    const [formulario, setFormulario] = useState({
        id: "",
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        numeroDocumento: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        ciudadExpedicion: "",
        libretaMilitar: "",
        estadoCivil: "",
        genero: "",
        direccion: "",
        telefono: "",
        correo: "",
        tipoEmpleado: "",
        cargo: ""
    });
    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);

            // Obtener el último contrato del empleado
            fetch(`http://localhost:8080/contratos/ultimo-contrato/${empleado.id}`)
                .then(res => {
                    if (!res.ok) throw new Error("Error al obtener el contrato");
                    return res.json();
                })
                .then(data => {
                    const contratoPreparado = {
                        id: data.id ?? data.contratoId ?? null,
                        fechaIngreso: data.fechaIngreso ?? "",
                        fechaRetiro: data.fechaRetiro ?? "",
                        fechaRenuncia: data.fechaRenuncia ?? "",
                        fechaOtroSi: data.fechaOtroSi ?? "",
                        omiso: data.omiso ?? "",
                        continua: typeof data.continua === "boolean" ? data.continua : true,
                        vacacionesDesde: data.vacacionesDesde ?? "",
                        vacacionesHasta: data.vacacionesHasta ?? ""
                    };
                    setContratos([contratoPreparado]); // Lo ponemos como array de un solo contrato
                })
                .catch(error => {
                    console.error("Error al obtener contrato:", error);
                    setContratos([]); // Si hay error, dejar vacío
                });
        }
    }, [empleado]);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };
    const handleContratoChange = (index, field, value) => {
        const nuevosContratos = [...contratos];
        nuevosContratos[index] = {
            ...nuevosContratos[index],
            [field]: value
        };
        setContratos(nuevosContratos);
    };
    const actualizarEmpleado = () => {
        fetch("http://localhost:8080/empleados", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        })
            .then(async (response) => {
                if (!response.ok) {
                    const errores = await response.json();
                    let mensaje;

                    if (Array.isArray(errores)) {
                        // Errores múltiples de validación
                        mensaje = errores.map(err => `<strong>${err.campo}</strong>: ${err.error}`).join("<br>");
                    } else if (errores.campo && errores.error) {
                        // Error individual con campo (como un enum incorrecto)
                        mensaje = `<strong>${errores.campo}</strong>: ${errores.error}`;
                    } else if (errores.error) {
                        // Error general sin campo
                        mensaje = errores.error;
                    } else {
                        mensaje = "Ocurrió un error desconocido";
                    }

                    throw new Error(mensaje);
                }

                return response.json();
            })
            .then((data) => {
                const continuaAntes = empleado.continua;
                const continuaDespues = contratos[0]?.continua;

                const accion = continuaAntes !== continuaDespues ? "recargar" : "actualizar";

                onActualizado(accion, data); // Aquí pasas la acción y el empleado actualizado

                onClose(); // cierra el modal

                Swal.fire({
                    icon: "success",
                    title: "Actualización exitosa",
                    html: `Los datos de: <strong>${data.nombres} ${data.apellidos}</strong> fueron actualizados correctamente.`,
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Error en la actualización",
                    html: error.message
                });
            });
    };

    const actualizarContrato = (contrato) => {

        fetch("http://localhost:8080/contratos", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contrato)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar contrato");
                Swal.fire("Contrato actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const agregarContrato = () => {
        if (!empleado || !empleado.id) {
            Swal.fire("Error", "Empleado no definido", "error");
            return;
        }

        const nuevoContrato = {
            fechaIngreso: "",
            fechaRetiro: "",
            fechaRenuncia: "",
            fechaOtroSi: "",
            omiso: "",
            continua: true,
            vacacionesDesde: "",
            vacacionesHasta: ""
        };

        fetch(`http://localhost:8080/contratos/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(nuevoContrato)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al agregar contrato");
                return res.text(); // ya que solo devuelve un mensaje de texto
            })
            .then(() => {
                // Volver a cargar todos los contratos desde el backend
                fetch(`http://localhost:8080/contratos/por-empleado/${empleado.id}`)
                    .then(res => res.json())
                    .then(data => {
                        const contratosPreparados = (Array.isArray(data) ? data : []).map(c => ({
                            id: c.id ?? c.contratoId ?? null,
                            fechaIngreso: c.fechaIngreso ?? "",
                            fechaRetiro: c.fechaRetiro ?? "",
                            fechaRenuncia: c.fechaRenuncia ?? "",
                            fechaOtroSi: c.fechaOtroSi ?? "",
                            omiso: c.omiso ?? "",
                            continua: typeof c.continua === "boolean" ? c.continua : true,
                            vacacionesDesde: c.vacacionesDesde ?? "",
                            vacacionesHasta: c.vacacionesHasta ?? ""
                        }));
                        setContratos(contratosPreparados);

                        Swal.fire("Contrato agregado correctamente", "", "success");
                    });
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };


    if (!visible) return null;

    return (
        <div className="modal" style={{ display: "block", backgroundColor: "#000000aa" }}>
            <div className="modal-dialog">
                <div className="modal-content p-4">
                    <h4>Editar Empleado</h4>
                    <input type="text"
                        name="nombres"
                        value={formulario.nombres}
                        onChange={handleChange}
                        placeholder="Nombres"
                        className="form-control mb-2"
                    />
                    <input type="text"
                        name="apellidos"
                        value={formulario.apellidos}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Apellidos"
                    />
                    <input type="text"
                        name="tipoDocumento"
                        value={formulario.tipoDocumento}
                        onChange={handleChange}
                        placeholder="Tipo de Documento"
                    />
                    <input type="number"
                        name="numeroDocumento"
                        value={formulario.numeroDocumento}
                        onChange={handleChange}
                        placeholder="Número de Documento"
                    />
                    <input type="date"
                        name="fechaNacimiento"
                        value={formulario.fechaNacimiento}
                        onChange={handleChange}
                        placeholder="Seleccione la fecha de nacimiento"
                    />
                    <input type="text"
                        name="lugarNacimiento"
                        value={formulario.lugarNacimiento}
                        onChange={handleChange}
                        placeholder="Lugar de Nacimiento"
                    />
                    <input type="text"
                        name="ciudadExpedicion"
                        value={formulario.ciudadExpedicion}
                        onChange={handleChange}
                        placeholder="Ciudad de Expedición"
                    />
                    <input type="text"
                        name="libretaMilitar"
                        value={formulario.libretaMilitar}
                        onChange={handleChange}
                        placeholder="Libreta Militar"
                    />
                    <input type="text"
                        name="estadoCivil"
                        value={formulario.estadoCivil}
                        onChange={handleChange}
                        placeholder="Estado Civilr"
                    />
                    <input type="text"
                        name="genero"
                        value={formulario.genero}
                        onChange={handleChange}
                        placeholder="Género"
                    />
                    <input type="text"
                        name="direccion"
                        value={formulario.direccion}
                        onChange={handleChange}
                        placeholder="Dirección"
                    />
                    <input type="number"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={handleChange}
                        placeholder="Teléfono"
                    />
                    <input type="email"
                        name="correo"
                        value={formulario.correo}
                        onChange={handleChange}
                        placeholder="Correo Electrónico"
                    />
                    <input type="text"
                        name="tipoEmpleado"
                        value={formulario.tipoEmpleado}
                        onChange={handleChange}
                        placeholder="Tipo de Empleado"
                    />
                    <input type="text"
                        name="cargo"
                        value={formulario.cargo}
                        onChange={handleChange}
                        placeholder="Cargo"
                    />
                    <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                            <h5 className="mb-0">Contratos Registrados</h5>
                            <div>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#tablaContratos"
                                    aria-expanded="false"
                                    aria-controls="tablaContratos"
                                >
                                    Mostrar/Ocultar Contratos
                                </button>

                            </div>
                        </div>

                        <div className="collapse" id="tablaContratos">

                            <div className="d-flex justify-content-end mb-2">
                                <button
                                    className="btn btn-outline-primary"
                                    onClick={agregarContrato}
                                >
                                    Agregar Nuevo Contrato
                                </button>

                            </div>
                            <table className="table table-bordered">

                                <tbody>
                                    {contratos.map((c, idx) => (
                                        <div key={c.id || idx} className="border rounded p-3 mb-3 bg-light">
                                            <div className="row mb-2">
                                                <div className="col-md-6">
                                                    <label>Fecha de Ingreso:</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.fechaIngreso ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "fechaIngreso", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Fecha de Retiro:</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.fechaRetiro ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "fechaRetiro", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-md-6">
                                                    <label>Fecha de Renuncia:</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.fechaRenuncia ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "fechaRenuncia", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Fecha Otro Sí:</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.fechaOtroSi ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "fechaOtroSi", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="row mb-2">
                                                <div className="col-md-6">
                                                    <label>Omiso:</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={c.omiso ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "omiso", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6 d-flex align-items-center pt-4">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            checked={!!c.continua}
                                                            onChange={(e) => handleContratoChange(idx, "continua", e.target.checked)}
                                                        />
                                                        <label className="form-check-label ms-2">¿Continúa?</label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-6">
                                                    <label>Vacaciones Desde:</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.vacacionesDesde ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "vacacionesDesde", e.target.value)}
                                                    />
                                                </div>
                                                <div className="col-md-6">
                                                    <label>Vacaciones Hasta:</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.vacacionesHasta ?? ""}
                                                        onChange={(e) => handleContratoChange(idx, "vacacionesHasta", e.target.value)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-end">
                                                <button className="btn btn-success btn-sm" onClick={() => actualizarContrato(c)}>
                                                    Guardar Contrato
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button onClick={() => {
                            Swal.fire({
                                title: "¿Quieres guardar los cambios?",
                                showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: "Guardar",
                                denyButtonText: `No guardar`
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    actualizarEmpleado(); //Se invoca la function para actualizar los datos
                                    Swal.fire("Guardado!", "", "success");
                                } else if (result.isDenied) {
                                    Swal.fire("Los cambios no se guardaron", "", "info");
                                }
                            });
                        }} className="btn btn-warning me-2">
                            Actualizar
                        </button>
                        <button
                            onClick={() => {
                                if (empleado) setFormulario(empleado); // Restaurar los datos originales
                                onClose(); // Cierra el modal
                                Swal.fire("Cancelado por el usuario")
                            }}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

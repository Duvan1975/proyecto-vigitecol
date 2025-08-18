import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export function ModalEditar({ empleado, visible, onClose, onActualizado }) {

    const [mostrarTodosContratos, setMostrarTodosContratos] = useState(false);

    const [familiares, setFamiliares] = useState([]);

    //Estado para agregar familiares modificado para que siempre sea visible en la tabla familiares
    const [nuevoFamiliar, setNuevoFamiliar] = useState({
        tipoFamiliar: "",
        nombreFamiliar: "",
        edadFamiliar: ""

    });

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
                        numeroContrato: data.numeroContrato ?? null,
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

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);

            //Obtener familiares de la persona por ID
            fetch(`http://localhost:8080/familiares/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const familiaresPreparados = (Array.isArray(data) ? data : []).map(f => ({
                        id: f.id ?? f.familiarId ?? null,
                        tipoFamiliar: f.tipoFamiliar ?? "",
                        nombreFamiliar: f.nombreFamiliar ?? "",
                        edadFamiliar: f.edadFamiliar !== undefined ? f.edadFamiliar : ""
                    }));
                    setFamiliares(familiaresPreparados);
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
    //Asegura que el state de familiares se actualice correctamente con el nuevo valor ingresado
    const handleFamiliarChange = (index, field, value) => {
        const nuevosFamiliares = [...familiares];
        nuevosFamiliares[index] = {
            ...nuevosFamiliares[index],
            [field]: value
        };
        setFamiliares(nuevosFamiliares);
    };
    const actualizarEmpleado = () => {

        /*if (nuevoFamiliar && (
            nuevoFamiliar.tipoFamiliar ||
            nuevoFamiliar.nombreFamiliar ||
            nuevoFamiliar.edadFamiliar
        )) {
            Swal.fire({
                title: "Familiar incompleto",
                text: "Tienes un familiar en proceso de registro. Completa o cancela el registro antes de actualizar.",
                icon: "warning"
            });
            return;
        }*/

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

                onActualizado(accion, data); // Se pasa la acción y el empleado actualizado

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

    const actualizarFamiliar = (familiar) => {

        fetch("http://localhost:8080/familiares", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(familiar)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar familiar");
                Swal.fire("Familiar actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    //Function para registrar un nuevo hijo/hijastros en el Modal
    const registrarNuevoFamiliar = () => {

        // Valida que ningún campo este vacío
        if (
            !nuevoFamiliar.tipoFamiliar ||
            !nuevoFamiliar.nombreFamiliar.trim() ||
            nuevoFamiliar.edadFamiliar === "" ||
            isNaN(parseInt(nuevoFamiliar.edadFamiliar))
        ) {
            Swal.fire("Campos incompletos", "Por favor llena todos los campos.", "warning");
            return;
        }

        fetch(`http://localhost:8080/familiares/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([
                {
                    tipoFamiliar: nuevoFamiliar.tipoFamiliar,
                    nombreFamiliar: nuevoFamiliar.nombreFamiliar,
                    edadFamiliar: parseInt(nuevoFamiliar.edadFamiliar, 10)
                }
            ])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar familiar");
                return res.json();
            })
            .then((familiarCreado) => {

                // Agregar el familiar creado a la lista

                setFamiliares(prev => [...prev, {
                    id: familiarCreado.id ?? familiarCreado.familiarId,
                    tipoFamiliar: nuevoFamiliar.tipoFamiliar,
                    nombreFamiliar: nuevoFamiliar.nombreFamiliar,
                    edadFamiliar: parseInt(nuevoFamiliar.edadFamiliar, 10)
                }]);

                // Resetear los campos PERO mantener el formulario visible

                setNuevoFamiliar({
                    tipoFamiliar: "",
                    nombreFamiliar: "",
                    edadFamiliar: ""
                });

                Swal.fire("Familiar agregado", "El familiar ha sido registrado correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
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
                //return res.text(); // ya que solo devuelve un mensaje de texto
            })
            .then(() => {
                // Volver a cargar todos los contratos desde el backend
                fetch(`http://localhost:8080/contratos/por-empleado/${empleado.id}`)
                    .then(res => res.json())
                    .then(data => {
                        const contratosPreparados = (Array.isArray(data) ? data : []).map(c => ({
                            id: c.id ?? c.contratoId ?? null,
                            numeroContrato: c.numeroContrato ?? "",
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

    const eliminarContrato = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:8080/contratos/${id}`, {
                    method: "DELETE",
                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar contrato");
                        // Elimina el contrato del estado
                        setContratos((prev) => prev.filter((contrato) => contrato.id !== id));
                        Swal.fire("Eliminado", "El contrato ha sido eliminado", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const cargarTodosContratos = () => {
        fetch(`http://localhost:8080/contratos/por-empleado/${empleado.id}`)
            .then(res => res.json())
            .then(data => {
                const contratosPreparados = data.map(c => ({
                    id: c.id ?? c.contratoId ?? null,
                    numeroContrato: c.numeroContrato ?? "",
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
                setMostrarTodosContratos(true);
            })
            .catch(err => {
                Swal.fire("Error", "No se pudieron cargar los contratos", "error");
            });
    };
    const eliminarFamiliar = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este familiar será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const token = localStorage.getItem("token");

                fetch(`http://localhost:8080/familiares/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar familiar");
                        setFamiliares(familiares.filter(f => f.id !== id));
                        Swal.fire("Eliminado", "El familiar fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    if (!visible) return null;

    return (
        <div className="modal" style={{ display: "block", backgroundColor: "#000000aa" }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content p-4" style={{ backgroundColor: "#f0f0f0" }}>
                    <h4 className="alinearTexto">Editar Empleado</h4>

                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Nombres:</strong></label>
                            <input type="text"
                                name="nombres"
                                value={formulario.nombres}
                                onChange={handleChange}
                                placeholder="Nombres"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Apellidos:</strong></label>
                            <input type="text"
                                name="apellidos"
                                value={formulario.apellidos}
                                onChange={handleChange}
                                placeholder="Apellidos"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="tipoDocumento"><strong>Tipo de Documento:</strong></label>
                            <select
                                name="tipoDocumento"
                                value={formulario.tipoDocumento}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="CC">CÉDULA DE CIUDADANÍA (CC)</option>
                                <option value="CE">CÉDULA DE EXTRANJERÍA (CE)</option>
                                <option value="TI">TARJETA DE IDENTIDAD (TI)</option>
                                <option value="PPT">PERMISO DE PERMANENCIA (PPT)</option>
                            </select>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Número de Documento:</strong></label>
                            <input type="number"
                                name="numeroDocumento"
                                value={formulario.numeroDocumento}
                                onChange={handleChange}
                                placeholder="Número de Documento"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Fecha de Nacimiento:</strong></label>
                            <input type="date"
                                name="fechaNacimiento"
                                value={formulario.fechaNacimiento}
                                onChange={handleChange}
                                placeholder="Seleccione la fecha de nacimiento"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Edad:</strong></label>
                            <input type="number"
                                name="edad"
                                value={formulario.edad}
                                onChange={handleChange}
                                placeholder="Seleccione la fecha de nacimiento"
                                className="form-control mb-2"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Lugar de Nacimiento:</strong></label>
                            <input type="text"
                                name="lugarNacimiento"
                                value={formulario.lugarNacimiento}
                                onChange={handleChange}
                                placeholder="Lugar de Nacimiento"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Ciudad de Expedición:</strong></label>
                            <input type="text"
                                name="ciudadExpedicion"
                                value={formulario.ciudadExpedicion}
                                onChange={handleChange}
                                placeholder="Ciudad de Expedición"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="tipoDocumento"><strong>Libreta Militar:</strong></label>
                            <select
                                name="libretaMilitar"
                                value={formulario.libretaMilitar}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="PRIMERA">PRIMERA CLASE</option>
                                <option value="SEGUNDA">SEGUNDA CLASE</option>
                                <option value="NO_TIENE">NO TIENE</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="tipoDocumento"><strong>Estado Civil:</strong></label>
                            <select
                                name="estadoCivil"
                                value={formulario.estadoCivil}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="CASADO">CASADO(A)</option>
                                <option value="SOLTERO">SOLTERO(A)</option>
                                <option value="VIUDO">VIUDO(A)</option>
                                <option value="SEPARADO">SEPARADO(A)</option>
                                <option value="UNION_LIBRE">UNIÓN LIBRE</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Género:</strong></label>
                            <select
                                name="genero"
                                value={formulario.genero}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="MASCULINO">MASCULINO</option>
                                <option value="FEMENINO">FEMENINO</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Dirección:</strong></label>
                            <input type="text"
                                name="direccion"
                                value={formulario.direccion}
                                onChange={handleChange}
                                placeholder="Dirección"
                                className="form-control mb-2"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Teléfono:</strong></label>
                            <input type="number"
                                name="telefono"
                                value={formulario.telefono}
                                onChange={handleChange}
                                placeholder="Teléfono"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Correo Electrónico:</strong></label>
                            <input type="email"
                                name="correo"
                                value={formulario.correo}
                                onChange={handleChange}
                                placeholder="Correo Electrónico"
                                className="form-control mb-2"
                            />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Tipo de Empleado:</strong></label>
                            <select
                                name="tipoEmpleado"
                                value={formulario.tipoEmpleado}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="ADMINISTRATIVO">ADMINISTRATIVO</option>
                                <option value="OPERATIVO">OPERATIVO</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Cargo:</strong></label>
                            <input type="text"
                                name="cargo"
                                value={formulario.cargo}
                                onChange={handleChange}
                                placeholder="Cargo"
                                className="form-control mb-2"
                            />
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
                            <h5 className="mb-0">Registrar Actualizar Hijos</h5>

                            <div>
                                <button
                                    className="btn btn-outline-secondary me-2"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#tablaFamiliares"
                                    aria-expanded="false"
                                    aria-controls="tablaFamiliares"
                                >
                                    Mostrar/Ocultar Familiares
                                </button>
                            </div>
                        </div>

                        <div className="collapse" id="tablaFamiliares">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Nombre</th>
                                        <th>Edad</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nuevoFamiliar && (
                                        <tr>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={nuevoFamiliar.tipoFamiliar}
                                                    onChange={(e) =>
                                                        setNuevoFamiliar({ ...nuevoFamiliar, tipoFamiliar: e.target.value })
                                                    }
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="HIJOS">HIJOS</option>
                                                    <option value="HIJASTROS">HIJASTROS</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Agregar Nombre Familiar"
                                                    value={nuevoFamiliar.nombreFamiliar}
                                                    onChange={(e) =>
                                                        setNuevoFamiliar({ ...nuevoFamiliar, nombreFamiliar: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    placeholder="Agregar Edad Familiar"
                                                    value={nuevoFamiliar.edadFamiliar}
                                                    onChange={(e) =>
                                                        setNuevoFamiliar({ ...nuevoFamiliar, edadFamiliar: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm" onClick={registrarNuevoFamiliar}>
                                                    Agregar
                                                </button>

                                            </td>
                                        </tr>
                                    )}

                                    {familiares.map((f, idx) => (
                                        <tr key={f.id || idx}>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={f.tipoFamiliar !== undefined && f.tipoFamiliar !== null ? f.tipoFamiliar : ""}
                                                    onChange={(e) => handleFamiliarChange(idx, "tipoFamiliar", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="HIJOS">HIJOS</option>
                                                    <option value="HIJASTROS">HIJASTROS</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={f.nombreFamiliar !== undefined && f.nombreFamiliar !== null ? f.nombreFamiliar : ""}
                                                    onChange={(e) => handleFamiliarChange(idx, "nombreFamiliar", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={f.edadFamiliar !== null && f.edadFamiliar !== undefined ? f.edadFamiliar : ""}
                                                    onChange={(e) => handleFamiliarChange(idx, "edadFamiliar", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => actualizarFamiliar(f)}
                                                >
                                                    Guardar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarFamiliar(f.id)}
                                                    title="Eliminar"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <hr />

                        <div className="mt-1">
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-2 alinearTexto">
                                <h5 className="mb-0">Contratos Registrados</h5>
                                <div>
                                    <button
                                        className="btn btn-secondary me-2"
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
                                <table className="table table-bordered">
                                    <tbody>
                                        {contratos.map((c, idx) => (
                                            <div key={c.id || idx} className="border rounded p-3 mb-3 bg-light">
                                                <div className="row">
                                                    <h5 className="mb-3">Contrato Número {c.numeroContrato || "N/D"}</h5>
                                                    <div className="col-md-3">
                                                        <label><strong>Fecha de Ingreso:</strong></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={c.fechaIngreso ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "fechaIngreso", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label><strong>Fecha de Retiro:</strong></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={c.fechaRetiro ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "fechaRetiro", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label><strong>Fecha de Renuncia:</strong></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={c.fechaRenuncia ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "fechaRenuncia", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label><strong>Otro Si:</strong></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={c.fechaOtroSi ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "fechaOtroSi", e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <label><strong>Omiso:</strong></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={c.omiso ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "omiso", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label><strong>¿Continúa?</strong></label>
                                                        <select
                                                            className="form-select"
                                                            value={c.continua ? "true" : "false"}
                                                            onChange={(e) => handleContratoChange(idx, "continua", e.target.value === "true")}
                                                        >
                                                            <option value="true">Sí</option>
                                                            <option value="false">No</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <label><strong>Terminación de Contrato Desde:</strong></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={c.vacacionesDesde ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "vacacionesDesde", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-3">
                                                        <label><strong>Terminación de Contrato Hasta:</strong></label>
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={c.vacacionesHasta ?? ""}
                                                            onChange={(e) => handleContratoChange(idx, "vacacionesHasta", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-end d-flex justify-content-end gap-2">
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => actualizarContrato(c)}
                                                    >
                                                        Guardar Contrato
                                                    </button>

                                                    {c.id && (
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => eliminarContrato(c.id)}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="d-flex justify-content-end">
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={agregarContrato}
                                    >
                                        Agregar Nuevo Contrato
                                    </button>
                                    <button
                                        className="btn btn-info"
                                        onClick={() => {
                                            if (!mostrarTodosContratos) {
                                                cargarTodosContratos(); // ← muestra todos
                                            } else {
                                                // ← dejamos solo el contrato más reciente
                                                fetch(`http://localhost:8080/contratos/ultimo-contrato/${empleado.id}`)
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        const contratoUnico = {
                                                            id: data.id ?? data.contratoId ?? null,
                                                            numeroContrato: data.numeroContrato ?? "",
                                                            fechaIngreso: data.fechaIngreso ?? "",
                                                            fechaRetiro: data.fechaRetiro ?? "",
                                                            fechaRenuncia: data.fechaRenuncia ?? "",
                                                            fechaOtroSi: data.fechaOtroSi ?? "",
                                                            omiso: data.omiso ?? "",
                                                            continua: typeof data.continua === "boolean" ? data.continua : true,
                                                            vacacionesDesde: data.vacacionesDesde ?? "",
                                                            vacacionesHasta: data.vacacionesHasta ?? ""
                                                        };
                                                        setContratos([contratoUnico]);
                                                        setMostrarTodosContratos(false); // actualiza estado
                                                    })
                                                    .catch(err => {
                                                        Swal.fire("Error", "No se pudo cargar el contrato más reciente", "error");
                                                    });
                                            }
                                        }}
                                    >
                                        {mostrarTodosContratos ? "Ocultar contratos anteriores" : "Mostrar todos los contratos"}
                                    </button>
                                </div>
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
        </div>
    );
};

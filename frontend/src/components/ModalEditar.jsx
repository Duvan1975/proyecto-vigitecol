import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { authFetch } from "../utils/authFetch";
import BotonToggle from "./BotonToggle";

export function ModalEditar({ empleado, visible, onClose, onActualizado }) {

    const [mostrarTodosContratos, setMostrarTodosContratos] = useState(false);

    const [familiares, setFamiliares] = useState([]);

    const [cursos, setCursos] = useState([]);

    const [estudios, setEstudios] = useState([]);

    const [experienciasLaborales, setExperienciasLaborales] = useState([]);

    const [afiliaciones, setAfiliaciones] = useState([]);

    const [documentos, setDocumentos] = useState([]);

    const [vehiculos, setVehiculos] = useState([]);


    //Estado para agregar familiares modificado para que siempre sea visible en la tabla familiares
    const [nuevoFamiliar, setNuevoFamiliar] = useState({
        tipoFamiliar: "",
        nombreFamiliar: "",
        edadFamiliar: ""

    });

    //Estado para agregar cursos
    const [nuevoCurso, setNuevoCurso] = useState({
        tipoCurso: "",
        categoria: "",
        fechaCurso: "",
        funcionEspecifica: ""
    });

    //Estado para agregar estudios
    const [nuevoEstudio, setNuevoEstudio] = useState({
        tipoEstudio: "",
        nombreEstudio: "",
        fechaEstudio: ""
    });

    //Estado para agregar Experiencias Laborales
    const [nuevaExperienciaLaboral, setNuevaExperienciaLaboral] = useState({
        descripcionExperiencia: ""
    });

    //Estado para agregar afiliaciones
    const [nuevaAfiliacion, setNuevaAfiliacion] = useState({
        tipoAfiliacion: "",
        nombreEntidad: "",
        fechaAfiliacion: ""
    });

    //Estado para agregar documentos
    const [nuevoDocumento, setNuevoDocumento] = useState({
        tipoOtroDocumento: "",
        descripcionDocumento: "",
        fechaRegistro: ""
    });

    //Estado para agregar vehículos
    const [nuevoVehiculo, setNuevoVehiculo] = useState({
        tipoVehiculo: "",
        tecnomecanico: "",
        soat: "",
        licencia: "",
        placa: ""
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
        tipoPoblacion: "",
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
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            // Obtener el último contrato del empleado
            authFetch(`${backendUrl}/contratos/ultimo-contrato/${empleado.id}`)
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
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener familiares del empleado por ID
            authFetch(`${backendUrl}/familiares/por-empleado/${empleado.id}`, {

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

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener cursos del empleado por ID
            authFetch(`${backendUrl}/cursos/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const cursosPreparados = (Array.isArray(data) ? data : []).map(cu => ({
                        id: cu.id ?? cu.cursoId ?? null,
                        tipoCurso: cu.tipoCurso ?? "",
                        categoria: cu.categoria ?? "",
                        fechaCurso: cu.fechaCurso ?? "",
                        funcionEspecifica: cu.funcionEspecifica ?? ""
                    }));
                    setCursos(cursosPreparados);
                });
        }
    }, [empleado]);

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener estudios del empleado por ID
            authFetch(`${backendUrl}/estudios/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const estudiosPreparados = (Array.isArray(data) ? data : []).map(es => ({
                        id: es.id ?? es.estudioId ?? null,
                        tipoEstudio: es.tipoEstudio ?? "",
                        nombreEstudio: es.nombreEstudio ?? "",
                        fechaEstudio: es.fechaEstudio ?? ""
                    }));
                    setEstudios(estudiosPreparados);
                });
        }
    }, [empleado]);

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener experiencias laborales del empleado por ID
            authFetch(`${backendUrl}/experienciasLaborales/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const experienciasPreparadas = (Array.isArray(data) ? data : []).map(ex => ({
                        id: ex.id ?? ex.experienciaLaboralId ?? null,
                        descripcionExperiencia: ex.descripcionExperiencia ?? ""
                    }));
                    setExperienciasLaborales(experienciasPreparadas);
                });
        }
    }, [empleado]);

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener afiliaciones del empleado por ID
            authFetch(`${backendUrl}/afiliaciones/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const afiliacionesPreparadas = (Array.isArray(data) ? data : []).map(af => ({
                        id: af.id ?? af.afiliacionId ?? null,
                        tipoAfiliacion: af.tipoAfiliacion ?? "",
                        nombreEntidad: af.nombreEntidad ?? "",
                        fechaAfiliacion: af.fechaAfiliacion ?? ""
                    }));
                    setAfiliaciones(afiliacionesPreparadas);
                });
        }
    }, [empleado]);

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener documentos del empleado por ID
            authFetch(`${backendUrl}/documentos/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const documentosPreparados = (Array.isArray(data) ? data : []).map(d => ({
                        id: d.id ?? d.documentoId ?? null,
                        tipoOtroDocumento: d.tipoOtroDocumento ?? "",
                        descripcionDocumento: d.descripcionDocumento ?? "",
                        fechaRegistro: d.fechaRegistro ?? ""
                    }));
                    setDocumentos(documentosPreparados);
                });
        }
    }, [empleado]);

    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            //Obtener vehiculos del empleado por ID
            authFetch(`${backendUrl}/vehiculos/por-empleado/${empleado.id}`, {

            })
                .then(res => res.json())
                .then(data => {
                    const vehiculosPreparados = (Array.isArray(data) ? data : []).map(v => ({
                        id: v.id ?? v.vehiculoId ?? null,
                        tipoVehiculo: v.tipoVehiculo ?? "",
                        tecnomecanico: v.tecnomecanico ?? "",
                        soat: v.soat ?? "",
                        licencia: v.licencia ?? "",
                        placa: v.placa ?? ""
                    }));
                    setVehiculos(vehiculosPreparados);
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

    const handleCursoChange = (index, field, value) => {
        const nuevosCursos = [...cursos];
        nuevosCursos[index] = {
            ...nuevosCursos[index],
            [field]: value
        };
        setCursos(nuevosCursos);
    };

    const handleEstudioChange = (index, field, value) => {
        const nuevosEstudios = [...estudios];
        nuevosEstudios[index] = {
            ...nuevosEstudios[index],
            [field]: value
        };
        setEstudios(nuevosEstudios);
    };

    const handleExperienciaLaboralChange = (index, field, value) => {
        const nuevasExperienciasLaborales = [...experienciasLaborales];
        nuevasExperienciasLaborales[index] = {
            ...nuevasExperienciasLaborales[index],
            [field]: value
        };
        setExperienciasLaborales(nuevasExperienciasLaborales);
    };

    const handleAfiliacionChange = (index, field, value) => {
        const nuevasAfiliaciones = [...afiliaciones];
        nuevasAfiliaciones[index] = {
            ...nuevasAfiliaciones[index],
            [field]: value
        };
        setAfiliaciones(nuevasAfiliaciones);
    };

    const handleDocumentoChange = (index, field, value) => {
        const nuevosDocumentos = [...documentos];
        nuevosDocumentos[index] = {
            ...nuevosDocumentos[index],
            [field]: value
        };
        setDocumentos(nuevosDocumentos);
    };

    const handleVehiculoChange = (index, field, value) => {
        const nuevosVehiculos = [...vehiculos];
        nuevosVehiculos[index] = {
            ...nuevosVehiculos[index],
            [field]: value
        };
        setVehiculos(nuevosVehiculos);
    };

    const actualizarEmpleado = () => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/empleados`, {
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
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/familiares`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(familiar)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar familiar. Actualiza los datos generales y vuelve a intentarlo");
                Swal.fire("Familiar actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarCurso = (curso) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/cursos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(curso)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar curso. Actualiza los datos generales y vuelve a intentarlo");
                Swal.fire("Curso actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarEstudio = (estudio) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/estudios`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(estudio)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar estudio. Actualiza los datos generales y vuelve a intentarlo");
                Swal.fire("Estudio actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarExperienciaLaboral = (experienciaLaboral) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/experienciasLaborales`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(experienciaLaboral)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar experiencia laboral. Actualiza los datos generales y vuelve a intentarlo");
                Swal.fire("Experiencia Laboral actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarAfiliacion = (afiliacion) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/afiliaciones`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(afiliacion)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar afiliación. Actualiza los datos generales y vuelve a intentarlo");
                Swal.fire("Afiliación actualizada correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarDocumento = (documento) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/documentos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(documento)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar el documento. Actualiza los datos generales y vuelve a intentarlo.");
                Swal.fire("Documento actualizado correctamente", "", "success");
            })
            .catch(err => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarVehiculo = (vehiculo) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/vehiculos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(vehiculo)
        })
            .then(res => {
                if (!res.ok) throw new Error("Error al actualizar el vehículo. Actualiza los datos generales y vuelve a intentarlo.");
                Swal.fire("Vehículo actualizado correctamente", "", "success");
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
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/familiares/${empleado.id}`, {
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

    //Function para registrar un nuevo curso en el Modal
    const registrarNuevoCurso = () => {

        // Validar tipoCurso
        if (!nuevoCurso.tipoCurso) {
            Swal.fire("Campo incompleto", "Por favor selecciona el tipo de Curso.", "warning");
            return;
        }

        if (!nuevoCurso.categoria) {
            Swal.fire("Campo incompleto", "Por favor selecciona el tipo de Especialidad.", "warning");
            return;
        }

        // Validar fechaCurso (vacía o inválida)
        if (!nuevoCurso.fechaCurso) {
            Swal.fire("Campo incompleto", "Por favor ingresa la fecha del curso.", "warning");
            return;
        }

        // Validar formato y validez real de la fecha
        const fecha = new Date(nuevoCurso.fechaCurso);
        if (isNaN(fecha.getTime())) {
            Swal.fire("Fecha inválida", "Verifica que la fecha tenga el formato correcto (yyyy-MM-dd).", "error");
            return;
        }
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/cursos/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([nuevoCurso])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar el curso");
                return res.json();
            })
            .then((cursoCreado) => {
                setCursos(prev => [...prev, {
                    id: cursoCreado.id ?? cursoCreado.cursoId,
                    tipoCurso: nuevoCurso.tipoCurso,
                    categoria: nuevoCurso.categoria,
                    fechaCurso: nuevoCurso.fechaCurso,
                    funcionEspecifica: nuevoCurso.funcionEspecifica
                }]);

                setNuevoCurso({ tipoCurso: "", categoria: "", fechaCurso: "", funcionEspecifica: "" });

                Swal.fire("Curso agregado", "El curso ha sido registrado correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    //Function para registrar un nuevo estudio en el Modal
    const registrarNuevoEstudio = () => {
        // Validar tipoEstudio
        if (!nuevoEstudio.tipoEstudio) {
            Swal.fire("Campo incompleto", "Por favor selecciona el tipo de estudio.", "warning");
            return;
        }

        // Validar fechaEstudio (vacía o inválida)
        /*if (!nuevoEstudio.fechaEstudio) {
            Swal.fire("Campo incompleto", "Por favor ingresa la fecha del estudio.", "warning");
            return;
        }*/

        // Si todo está correcto, proceder con el fetch
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/estudios/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([nuevoEstudio])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar el estudio");
                return res.json();
            })
            .then((estudioCreado) => {
                setEstudios(prev => [...prev, {
                    id: estudioCreado.id ?? estudioCreado.estudioId,
                    tipoEstudio: nuevoEstudio.tipoEstudio,
                    nombreEstudio: nuevoEstudio.nombreEstudio,
                    fechaEstudio: nuevoEstudio.fechaEstudio || null
                }]);

                setNuevoEstudio({ tipoEstudio: "", nombreEstudio: "", fechaEstudio: "" });

                Swal.fire("Estudio agregado", "El estudio ha sido registrado correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    //Function para registrar una nueva experiencia en el Modal
    const registrarNuevaExperienciaLaboral = () => {

        // Si todo está correcto, proceder con el fetch
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/experienciasLaborales/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([nuevaExperienciaLaboral])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar experiencia laboral");
                return res.json();
            })
            .then((experienciaLaboralCreada) => {
                setExperienciasLaborales(prev => [...prev, {
                    id: experienciaLaboralCreada.id ?? experienciaLaboralCreada.experienciaLaboralId,
                    descripcionExperiencia: nuevaExperienciaLaboral.descripcionExperiencia
                }]);

                setNuevaExperienciaLaboral({ descripcionExperiencia: "" });

                Swal.fire("Experiencia Laboral agregada", "Experiencia Laboral ha sido registrado correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    //Function para registrar una nueva afiliación en el Modal
    const registrarNuevaAfiliacion = () => {
        // Validar tipoAfiliacion
        if (!nuevaAfiliacion.tipoAfiliacion) {
            Swal.fire("Campo incompleto", "Por favor selecciona el tipo de afiliación.", "warning");
            return;
        }

        // Validar fechaAfiliacion (vacía o inválida)
        if (!nuevaAfiliacion.nombreEntidad) {
            Swal.fire("Campo incompleto", "Por favor ingresa el nombre de la entidad.", "warning");
            return;
        }

        // Si todo está correcto, proceder con el fetch
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/afiliaciones/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([nuevaAfiliacion])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar afiliación");
                return res.json();
            })
            .then((afiliacionCreada) => {
                setAfiliaciones(prev => [...prev, {
                    id: afiliacionCreada.id ?? afiliacionCreada.afiliacionId,
                    tipoAfiliacion: nuevaAfiliacion.tipoAfiliacion,
                    nombreEntidad: nuevaAfiliacion.nombreEntidad,
                    fechaAfiliacion: nuevaAfiliacion.fechaAfiliacion
                }]);

                setNuevaAfiliacion({ tipoAfiliacion: "", nombreEntidad: "", fechaAfiliacion: "" });

                Swal.fire("Afiliación agregada", "La afiliación ha sido registrada correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    //Function para registrar un nuevo documento en el Modal
    const registrarNuevoDocumento = () => {
        // Validar tipoOtroDocumento
        if (!nuevoDocumento.tipoOtroDocumento) {
            Swal.fire("Campo incompleto", "Por favor selecciona el tipo de documento.", "warning");
            return;
        }

        // Validar fechaRegistro (vacía o inválida)
        /*if (!nuevoDocumento.fechaRegistro) {
            Swal.fire("Campo incompleto", "Por favor ingresa la fecha de registro.", "warning");
            return;
        }*/

        // Si todo está correcto, proceder con el fetch
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/documentos/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([nuevoDocumento])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar el documento");
                return res.json();
            })
            .then((documentoCreado) => {
                setDocumentos(prev => [...prev, {
                    id: documentoCreado.id ?? documentoCreado.documentoId,
                    tipoOtroDocumento: nuevoDocumento.tipoOtroDocumento,
                    descripcionDocumento: nuevoDocumento.descripcionDocumento,
                    fechaRegistro: nuevoDocumento.fechaRegistro
                }]);

                setNuevoDocumento({ tipoOtroDocumento: "", descripcionDocumento: "", fechaRegistro: "" });

                Swal.fire("Documento agregado", "El documento ha sido registrado correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    //Function para registrar un nuevo vehículo en el Modal
    const registrarNuevoVehiculo = () => {
        // Validar tipoVehiculo
        if (!nuevoVehiculo.tipoVehiculo) {
            Swal.fire("Campo incompleto", "Por favor selecciona el tipo de vehículo.", "warning");
            return;
        }

        if (!nuevoVehiculo.tecnomecanico) {
            Swal.fire("Campo incompleto", "Por favor ingresa la fecha del tecnomecánico.", "warning");
            return;
        }

        if (!nuevoVehiculo.soat) {
            Swal.fire("Campo incompleto", "Por favor ingresa la fecha del soat.", "warning");
            return;
        }

        if (!nuevoVehiculo.licencia) {
            Swal.fire("Campo incompleto", "Por favor ingresa la fecha de licencia.", "warning");
            return;
        }

        if (!nuevoVehiculo.placa) {
            Swal.fire("Campo incompleto", "Por favor ingresa la placa del vehículo.", "warning");
            return;
        }

        // Si todo está correcto, proceder con el fetch
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/vehiculos/${empleado.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify([nuevoVehiculo])
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al registrar el vehículo");
                return res.json();
            })
            .then((vehiculoCreado) => {
                setVehiculos(prev => [...prev, {
                    id: vehiculoCreado.id ?? vehiculoCreado.vehiculoId,
                    tipoVehiculo: nuevoVehiculo.tipoVehiculo,
                    tecnomecanico: nuevoVehiculo.tecnomecanico,
                    soat: nuevoVehiculo.soat,
                    licencia: nuevoVehiculo.licencia,
                    placa: nuevoVehiculo.placa,

                }]);

                setNuevoVehiculo({ tipoVehiculo: "", tecnomecanico: "", soat: "", licencia: "", placa: "" });

                Swal.fire("Vehículo agregado", "El Vehículo ha sido registrado correctamente", "success");
            })
            .catch((err) => {
                Swal.fire("Error", err.message, "error");
            });
    };

    const actualizarContrato = (contrato) => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/contratos`, {
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
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/contratos/${empleado.id}`, {
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
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                // Volver a cargar todos los contratos desde el backend
                authFetch(`${backendUrl}/contratos/por-empleado/${empleado.id}`)
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
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/contratos/${id}`, {
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
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        authFetch(`${backendUrl}/contratos/por-empleado/${empleado.id}`)
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
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/familiares/${id}`, {
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

    const eliminarCurso = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este curso será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/cursos/${id}`, {
                    method: "DELETE",

                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar curso, (Debes actualizar los datos para poder eliminar)");
                        setCursos(cursos.filter(c => c.id !== id));
                        Swal.fire("Eliminado", "El curso fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const eliminarEstudio = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este estudio será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/estudios/${id}`, {
                    method: "DELETE",

                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar estudio, (Debes actualizar los datos para poder eliminar este registro)");
                        setEstudios(estudios.filter(es => es.id !== id));
                        Swal.fire("Eliminado", "El registro fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const eliminarExperienciaLaboral = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta Experiencia Laboral será eliminada.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/experienciasLaborales/${id}`, {
                    method: "DELETE",

                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar experiencia laboral, (Debes actualizar los datos para poder eliminar este registro)");
                        setExperienciasLaborales(experienciasLaborales.filter(ex => ex.id !== id));
                        Swal.fire("Eliminado", "El registro fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const eliminarAfiliacion = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta Afiliación será eliminada.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/afiliaciones/${id}`, {
                    method: "DELETE",

                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar afiliación, (Debes actualizar los datos para poder eliminar este registro)");
                        setAfiliaciones(afiliaciones.filter(af => af.id !== id));
                        Swal.fire("Eliminado", "El registro fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const eliminarDocumento = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este Documento será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/documentos/${id}`, {
                    method: "DELETE",

                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar documento, (Debes actualizar los datos generales para poder eliminar este registro)");
                        setDocumentos(documentos.filter(d => d.id !== id));
                        Swal.fire("Eliminado", "El documento fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    const eliminarVehiculo = (id) => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Este Registro será eliminado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                authFetch(`${backendUrl}/vehiculos/${id}`, {
                    method: "DELETE",

                })
                    .then((res) => {
                        if (!res.ok) throw new Error("Error al eliminar el vehículo, (Debes actualizar los datos para poder eliminar este registro)");
                        setVehiculos(vehiculos.filter(v => v.id !== id));
                        Swal.fire("Eliminado", "El vehículo fue eliminado correctamente", "success");
                    })
                    .catch((err) => {
                        Swal.fire("Error", err.message, "error");
                    });
            }
        });
    };

    /*const contratoMasReciente = contratos.length > 0
        ? contratos.reduce((max, c) =>
            c.numeroContrato > max.numeroContrato ? c : max, contratos[0])
        : null;*/

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
                            <label htmlFor=""> <strong>Fecha de Nacimiento:</strong></label>
                            <input type="date"
                                name="fechaNacimiento"
                                value={formulario.fechaNacimiento}
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
                            <label htmlFor=""><strong>Libreta Militar:</strong></label>
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
                            <label htmlFor=""><strong>Estado Civil:</strong></label>
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
                            <label htmlFor=""> <strong>Dirección:</strong></label>
                            <input type="text"
                                name="direccion"
                                value={formulario.direccion}
                                onChange={handleChange}
                                placeholder="Dirección"
                                className="form-control mb-2"
                            />
                        </div>
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
                    </div>

                    <div className="row">
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
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor=""> <strong>Tipo de Población:</strong></label>
                            <select
                                name="tipoPoblacion"
                                value={formulario.tipoPoblacion}
                                onChange={handleChange}
                                className="form-control mb-2"
                            >
                                <option value="AFRODESCENDIENTE">AFRODESCENDIENTE</option>
                                <option value="RAIZAL">RAIZAL</option>
                                <option value="INDIGENA">INDÍGENA</option>
                                <option value="GITANO">GITANO</option>
                                <option value="PALENQUERO">PALENQUERO</option>
                                <option value="NO_APLICA">NO APLICA</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                            <h5 className="alinearTexto mb-0">Registrar Actualizar Hijos</h5>
                            <BotonToggle target="#tablaFamiliares" texto="Familiares" />
                        </div>
                    </div>
                    <div className="mt-0">
                        <div className="collapse" id="tablaFamiliares">
                            <table className="table table-bordered">
                                <thead className="table-primary">
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
                                                <button className="btn btn-primary btn-sm"
                                                    onClick={registrarNuevoFamiliar}>
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
                                                    Actualizar
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

                        <div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                <h5 className="alinearTexto  mb-0">Registrar Actualizar Cursos</h5>
                                <BotonToggle target="#tablaCursos" texto="Cursos" />
                            </div>
                        </div>

                        <div className="collapse" id="tablaCursos">

                            <div className="table-responsive">
                                <table className="table table-hover table-striped mb-0 align-middle text-center">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Tipo Curso</th>
                                            <th>Especialidad</th>
                                            <th>Fecha de Realización</th>
                                            <th>Función Específica</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nuevoCurso && (
                                            <tr>
                                                <td style={{ minWidth: "200px" }}>
                                                    <select
                                                        className="form-select"
                                                        value={nuevoCurso.tipoCurso}
                                                        onChange={(e) =>
                                                            setNuevoCurso({
                                                                ...nuevoCurso,
                                                                tipoCurso: e.target.value
                                                            })
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="FUNDAMENTACION">FUNDAMENTACIÓN</option>
                                                        <option value="REENTRENAMIENTO">REENTRENAMIENTO</option>
                                                    </select>
                                                </td>
                                                <td style={{ minWidth: "200px" }}>
                                                    <select
                                                        className="form-select"
                                                        value={nuevoCurso.categoria}
                                                        onChange={(e) =>
                                                            setNuevoCurso({ ...nuevoCurso, categoria: e.target.value })
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="GUARDA_DE_SEGURIDAD">GUARDA DE SEGURIDAD</option>
                                                        <option value="MANEJADOR_CANINO">MANEJADOR CANINO</option>
                                                        <option value="SUPERVISOR">SUPERVISOR</option>
                                                        <option value="OPERADOR_DE_MEDIOS">OPERADOR DE MEDIOS</option>
                                                        <option value="ESCOLTA">ESCOLTA</option>
                                                    </select>
                                                </td>
                                                <td style={{ minWidth: "180px" }}>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        placeholder="Fecha de Realización"
                                                        value={nuevoCurso.fechaCurso}
                                                        onChange={(e) =>
                                                            setNuevoCurso({ ...nuevoCurso, fechaCurso: e.target.value })
                                                        }
                                                    />
                                                </td>
                                                <td style={{ minWidth: "200px" }}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Función Específica"
                                                        value={nuevoCurso.funcionEspecifica}
                                                        onChange={(e) =>
                                                            setNuevoCurso({ ...nuevoCurso, funcionEspecifica: e.target.value })
                                                        }
                                                    />
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <button className="btn btn-primary btn-sm"
                                                        onClick={registrarNuevoCurso}
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        {cursos.map((c, idx) => (
                                            <tr key={c.id || idx}>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={c.tipoCurso !== undefined && c.tipoCurso !== null ? c.tipoCurso : ""}
                                                        onChange={(e) => handleCursoChange(idx, "tipoCurso", e.target.value)}
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="FUNDAMENTACION">FUNDAMENTACION</option>
                                                        <option value="REENTRENAMIENTO">REENTRENAMIENTO</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={c.categoria !== undefined && c.categoria !== null ? c.categoria : ""}
                                                        onChange={(e) => handleCursoChange(idx, "categoria", e.target.value)}
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="GUARDA_DE_SEGURIDAD">GUARDA DE SEGURIDAD</option>
                                                        <option value="MANEJADOR_CANINO">MANEJADOR CANINO</option>
                                                        <option value="SUPERVISOR">SUPERVISOR</option>
                                                        <option value="OPERADOR_DE_MEDIOS">OPERADOR DE MEDIOS</option>
                                                        <option value="ESCOLTA">ESCOLTA</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={c.fechaCurso !== undefined && c.fechaCurso !== null ? c.fechaCurso : ""}
                                                        onChange={(e) => handleCursoChange(idx, "fechaCurso", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={c.funcionEspecifica !== undefined && c.funcionEspecifica !== null ? c.funcionEspecifica : ""}
                                                        onChange={(e) => handleCursoChange(idx, "funcionEspecifica", e.target.value)}
                                                    />
                                                </td>
                                                <td className="d-flex justify-content-between">
                                                    <button
                                                        className="btn btn-success btn-sm me-2"
                                                        onClick={() => actualizarCurso(c)}
                                                    >
                                                        Actualizar
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => eliminarCurso(c.id)}
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


                        </div>

                        <div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-1 mb-2">
                                <h5 className="alinearTexto  mb-0">Registrar Actualizar Estudios</h5>
                                <BotonToggle target="#tablaEstudios" texto="Estudios" />
                            </div>
                        </div>

                        <div className="collapse" id="tablaEstudios">
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Tipo Estudio</th>
                                        <th>Título Obtenido</th>
                                        <th>Fecha de Realización</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nuevoEstudio && (
                                        <tr>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={nuevoEstudio.tipoEstudio}
                                                    onChange={(e) =>
                                                        setNuevoEstudio({ ...nuevoEstudio, tipoEstudio: e.target.value })
                                                    }
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="BACHILLER_ACADEMICO">BACHILLER ACADÉMICO</option>
                                                    <option value="TECNICO">TÉCNICO</option>
                                                    <option value="OTRO">OTRO</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Título Obtenido"
                                                    value={nuevoEstudio.nombreEstudio}
                                                    onChange={(e) =>
                                                        setNuevoEstudio({ ...nuevoEstudio, nombreEstudio: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Fecha de Realización"
                                                    value={nuevoEstudio.fechaEstudio}
                                                    onChange={(e) =>
                                                        setNuevoEstudio({ ...nuevoEstudio, fechaEstudio: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm"
                                                    onClick={registrarNuevoEstudio}
                                                >
                                                    Agregar
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {estudios.map((es, idx) => (
                                        <tr key={es.id || idx}>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={es.tipoEstudio !== undefined && es.tipoEstudio !== null ? es.tipoEstudio : ""}
                                                    onChange={(e) => handleEstudioChange(idx, "tipoEstudio", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="BACHILLER_ACADEMICO">BACHILLER ACADÉMICO</option>
                                                    <option value="TECNICO">TÉCNICO</option>
                                                    <option value="OTRO">OTRO</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={es.nombreEstudio !== undefined && es.nombreEstudio !== null ? es.nombreEstudio : ""}
                                                    onChange={(e) => handleEstudioChange(idx, "nombreEstudio", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={es.fechaEstudio !== undefined && es.fechaEstudio !== null ? es.fechaEstudio : ""}
                                                    onChange={(e) => handleEstudioChange(idx, "fechaEstudio", e.target.value)}
                                                />
                                            </td>
                                            <td className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => actualizarEstudio(es)}
                                                >
                                                    Actualizar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarEstudio(es.id)}
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

                        <div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                <h5 className="alinearTexto  mb-0">Registrar Experiencia Laboral</h5>
                                <BotonToggle target="#tablaExperiencia" texto="Experiencia" />
                            </div>
                        </div>

                        <div className="collapse" id="tablaExperiencia">
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Descripción Experiencia Laboral</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nuevaExperienciaLaboral && (
                                        <tr>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Descripción Experiencia Laboral"
                                                    value={nuevaExperienciaLaboral.descripcionExperiencia}
                                                    onChange={(e) =>
                                                        setNuevaExperienciaLaboral({ ...nuevaExperienciaLaboral, descripcionExperiencia: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm"
                                                    onClick={registrarNuevaExperienciaLaboral}
                                                >
                                                    Agregar
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {experienciasLaborales.map((ex, idx) => (
                                        <tr key={ex.id || idx}>

                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={ex.descripcionExperiencia !== undefined && ex.descripcionExperiencia !== null ? ex.descripcionExperiencia : ""}
                                                    onChange={(e) => handleExperienciaLaboralChange(idx, "descripcionExperiencia", e.target.value)}
                                                />
                                            </td>
                                            <td className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => actualizarExperienciaLaboral(ex)}
                                                >
                                                    Actualizar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarExperienciaLaboral(ex.id)}
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

                        <div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                <h5 className="alinearTexto  mb-0">Registrar Actualizar Afiliaciones</h5>
                                <BotonToggle target="#tablaAfiliaciones" texto="Afiliaciones" />
                            </div>
                        </div>

                        <div className="collapse" id="tablaAfiliaciones">
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Tipo de Afiliación</th>
                                        <th>Nombre de la Entidad</th>
                                        <th>Fecha de Afiliación</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nuevaAfiliacion && (
                                        <tr>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={nuevaAfiliacion.tipoAfiliacion}
                                                    onChange={(e) =>
                                                        setNuevaAfiliacion({ ...nuevaAfiliacion, tipoAfiliacion: e.target.value })
                                                    }
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="SALUD">SALUD</option>
                                                    <option value="PENSION">PENSIÓN</option>
                                                    <option value="ARL">ARL</option>
                                                    <option value="CONFA">CONFA</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Nombre de la Entidad"
                                                    value={nuevaAfiliacion.nombreEntidad}
                                                    onChange={(e) =>
                                                        setNuevaAfiliacion({ ...nuevaAfiliacion, nombreEntidad: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Fecha de Afiliación"
                                                    value={nuevaAfiliacion.fechaAfiliacion}
                                                    onChange={(e) =>
                                                        setNuevaAfiliacion({ ...nuevaAfiliacion, fechaAfiliacion: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm"
                                                    onClick={registrarNuevaAfiliacion}
                                                >
                                                    Agregar
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {afiliaciones.map((af, idx) => (
                                        <tr key={af.id || idx}>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={af.tipoAfiliacion !== undefined && af.tipoAfiliacion !== null ? af.tipoAfiliacion : ""}
                                                    onChange={(e) => handleAfiliacionChange(idx, "tipoAfiliacion", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="SALUD">SALUD</option>
                                                    <option value="PENSION">PENSIÓN</option>
                                                    <option value="ARL">ARL</option>
                                                    <option value="CONFA">CONFA</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={af.nombreEntidad !== undefined && af.nombreEntidad !== null ? af.nombreEntidad : ""}
                                                    onChange={(e) => handleAfiliacionChange(idx, "nombreEntidad", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={af.fechaAfiliacion !== undefined && af.fechaAfiliacion !== null ? af.fechaAfiliacion : ""}
                                                    onChange={(e) => handleAfiliacionChange(idx, "fechaAfiliacion", e.target.value)}
                                                />
                                            </td>
                                            <td className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => actualizarAfiliacion(af)}
                                                >
                                                    Actualizar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarAfiliacion(af.id)}
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

                        <div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                <h5 className="alinearTexto  mb-0">Registrar Actualizar Documentos</h5>
                                <BotonToggle target="#tablaDocumentos" texto="Documentos" />
                            </div>
                        </div>

                        <div className="collapse" id="tablaDocumentos">
                            <table className="table table-bordered">
                                <thead className="table-primary">
                                    <tr>
                                        <th>Tipo de Documento</th>
                                        <th>Descripción</th>
                                        <th>Fecha de Registro</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {nuevoDocumento && (
                                        <tr>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={nuevoDocumento.tipoOtroDocumento}
                                                    onChange={(e) =>
                                                        setNuevoDocumento({ ...nuevoDocumento, tipoOtroDocumento: e.target.value })
                                                    }
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="JUDICIALES">JUDICIALES</option>
                                                    <option value="PROCURADURIA">PROCURADURIA</option>
                                                    <option value="CONTRALORIA">CONTRALORIA</option>
                                                    <option value="MEDIDAS_CORRECTIVAS">MEDIDAS CORRECTIVAS</option>
                                                    <option value="INHABILIDADES">INHABILIDADES</option>
                                                    <option value="LISTA_CLINTON">LISTA CLINTON</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Descripción"
                                                    value={nuevoDocumento.descripcionDocumento}
                                                    onChange={(e) =>
                                                        setNuevoDocumento({ ...nuevoDocumento, descripcionDocumento: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    placeholder="Fecha de Registro"
                                                    value={nuevoDocumento.fechaRegistro}
                                                    onChange={(e) =>
                                                        setNuevoDocumento({ ...nuevoDocumento, fechaRegistro: e.target.value })
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-primary btn-sm"
                                                    onClick={registrarNuevoDocumento}
                                                >
                                                    Agregar
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {documentos.map((d, idx) => (
                                        <tr key={d.id || idx}>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    value={d.tipoOtroDocumento !== undefined && d.tipoOtroDocumento !== null ? d.tipoOtroDocumento : ""}
                                                    onChange={(e) => handleDocumentoChange(idx, "tipoOtroDocumento", e.target.value)}
                                                >
                                                    <option value="">Seleccione</option>
                                                    <option value="JUDICIALES">JUDICIALES</option>
                                                    <option value="PROCURADURIA">PROCURADURIA</option>
                                                    <option value="CONTRALORIA">CONTRALORIA</option>
                                                    <option value="MEDIDAS_CORRECTIVAS">MEDIDAS CORRECTIVAS</option>
                                                    <option value="INHABILIDADES">INHABILIDADES</option>
                                                    <option value="LISTA_CLINTON">LISTA CLINTON</option>
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={d.descripcionDocumento !== undefined && d.descripcionDocumento !== null ? d.descripcionDocumento : ""}
                                                    onChange={(e) => handleDocumentoChange(idx, "descripcionDocumento", e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={d.fechaRegistro !== undefined && d.fechaRegistro !== null ? d.fechaRegistro : ""}
                                                    onChange={(e) => handleDocumentoChange(idx, "fechaRegistro", e.target.value)}
                                                />
                                            </td>
                                            <td className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-success btn-sm me-2"
                                                    onClick={() => actualizarDocumento(d)}
                                                >
                                                    Actualizar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => eliminarDocumento(d.id)}
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

                        <div>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center mt-2 mb-2">
                                <h5 className="alinearTexto  mb-0">Registrar Actualizar Vehículos</h5>
                                <BotonToggle target="#tablaVehiculos" texto="Vehículos" />
                            </div>
                        </div>

                        <div className="collapse" id="tablaVehiculos">
                            <div className="table-responsive">

                                <table className="table table-hover table-striped mb-0 align-middle text-center">
                                    <thead className="table-primary">
                                        <tr>
                                            <th>Tipo de Vehículo</th>
                                            <th>Tecnomecánico</th>
                                            <th>Soat</th>
                                            <th>Licencia</th>
                                            <th>Placa</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {nuevoVehiculo && (
                                            <tr>
                                                <td style={{ minWidth: "150px" }}>
                                                    <select
                                                        className="form-select"
                                                        value={nuevoVehiculo.tipoVehiculo}
                                                        onChange={(e) =>
                                                            setNuevoVehiculo({
                                                                ...nuevoVehiculo,
                                                                tipoVehiculo: e.target.value,
                                                            })
                                                        }
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="MOTO">MOTO</option>
                                                        <option value="CARRO">CARRO</option>
                                                    </select>
                                                </td>
                                                <td style={{ minWidth: "180px" }}>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={nuevoVehiculo.tecnomecanico}
                                                        onChange={(e) =>
                                                            setNuevoVehiculo({
                                                                ...nuevoVehiculo,
                                                                tecnomecanico: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td style={{ minWidth: "180px" }}>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={nuevoVehiculo.soat}
                                                        onChange={(e) =>
                                                            setNuevoVehiculo({
                                                                ...nuevoVehiculo,
                                                                soat: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td style={{ minWidth: "180px" }}>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={nuevoVehiculo.licencia}
                                                        onChange={(e) =>
                                                            setNuevoVehiculo({
                                                                ...nuevoVehiculo,
                                                                licencia: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td style={{ minWidth: "120px" }}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Placa"
                                                        value={nuevoVehiculo.placa}
                                                        onChange={(e) =>
                                                            setNuevoVehiculo({
                                                                ...nuevoVehiculo,
                                                                placa: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </td>
                                                <td style={{ minWidth: "100px" }}>
                                                    <button
                                                        className="btn btn-primary btn-sm w-90"
                                                        onClick={registrarNuevoVehiculo}
                                                    >
                                                        Agregar
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        {vehiculos.map((v, idx) => (
                                            <tr key={v.id || idx}>
                                                <td>
                                                    <select
                                                        className="form-select"
                                                        value={v.tipoVehiculo !== undefined && v.tipoVehiculo !== null ? v.tipoVehiculo : ""}
                                                        onChange={(e) => handleVehiculoChange(idx, "tipoVehiculo", e.target.value)}
                                                    >
                                                        <option value="">Seleccione</option>
                                                        <option value="MOTO">MOTO</option>
                                                        <option value="CARRO">CARRO</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={v.tecnomecanico !== undefined && v.tecnomecanico !== null ? v.tecnomecanico : ""}
                                                        onChange={(e) => handleVehiculoChange(idx, "tecnomecanico", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={v.soat !== undefined && v.soat !== null ? v.soat : ""}
                                                        onChange={(e) => handleVehiculoChange(idx, "soat", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={v.licencia !== undefined && v.licencia !== null ? v.licencia : ""}
                                                        onChange={(e) => handleVehiculoChange(idx, "licencia", e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={v.placa !== undefined && v.placa !== null ? v.placa : ""}
                                                        onChange={(e) => handleVehiculoChange(idx, "placa", e.target.value)}
                                                    />
                                                </td>
                                                <td className="d-flex justify-content-between">
                                                    <button
                                                        className="btn btn-success btn-sm me-2"
                                                        onClick={() => actualizarVehiculo(v)}
                                                    >
                                                        Actualizar
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={() => eliminarVehiculo(v.id)}
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
                                                        Guardar/Actualizar
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
                                                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                                                authFetch(`${backendUrl}/contratos/ultimo-contrato/${empleado.id}`)
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
                            <hr />
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

import { CuadrosTexto } from "./CuadrosTexto";
import { CuadrosSelect } from "./CuadrosSelect";
import { AgregarTabla } from "./AgregarTabla";
import { useState } from "react";

export function Formulario() {

    const [empleado, setEmpleado] = useState({
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

    //Estados para registrar familiares
    const [familiares, setFamiliares] = useState([]);
    const [familiarActual, setFamiliarActual] = useState({
        tipoFamiliar: "",
        nombreFamiliar: "",
        edadFamiliar: ""
    });

    //Estados para registrar Cursos de Vigilancia
    const [cursos, setCursos] = useState([]);
    const [cursoActual, setCursoActual] = useState({
        tipoCurso: "",
        categoria: "",
        fechaCurso: ""
    });

    //Estados para registrar Estudios
    const [estudios, setEstudios] = useState([]);
    const [estudioActual, setEstudioActual] = useState({
        tipoEstudio: "",
        nombreEstudio: "",
        fechaEstudio: ""
    });

    //Estado para registrar Experiencia Laboral
    const [experienciasLaborales, setExperienciasLaborales] = useState([]);
    const [experienciaLaboralActual, setExperienciaLaboralActual] = useState({
        descripcionExperiencia: ""
    });

    //Estados para registrar Afiliaciones
    const [afiliaciones, setAfiliaciones] = useState([]);
    const [afiliacionActual, setAfiliacionActual] = useState({
        tipoAfiliacion: "",
        nombreEntidad: "",
        fechaAfiliacion: ""
    });

    //Estado para registrar Contrato
    const [contrato, setContrato] = useState({
        fechaIngreso: ""
    });

    // Agregar familiar a la lista y limpiar campos
    const agregarFamiliar = () => {
        if (
            familiarActual.tipoFamiliar &&
            familiarActual.nombreFamiliar &&
            familiarActual.edadFamiliar
        ) {
            setFamiliares([...familiares, { ...familiarActual }]);
            setFamiliarActual({
                tipoFamiliar: "",
                nombreFamiliar: "",
                edadFamiliar: ""
            });
        }
    };

    const agregarCurso = () => {
        if (
            cursoActual.tipoCurso &&
            cursoActual.categoria &&
            cursoActual.fechaCurso
        ) {
            setCursos([...cursos, { ...cursoActual }]);
            setCursoActual({
                tipoCurso: "",
                categoria: "",
                fechaCurso: ""
            });
        }
    };

    const agregarEstudio = () => {
        if (
            estudioActual.tipoEstudio &&
            estudioActual.nombreEstudio &&
            estudioActual.fechaEstudio
        ) {
            setEstudios([...estudios, { ...estudioActual }]);
            setEstudioActual({
                tipoEstudio: "",
                nombreEstudio: "",
                fechaEstudio: ""
            });
        }
    };

    const agregarExperienciaLaboral = () => {
        if (
            experienciaLaboralActual.descripcionExperiencia
        ) {
            setExperienciasLaborales([...experienciasLaborales, { ...experienciaLaboralActual }]);
            setExperienciaLaboralActual({
                descripcionExperiencia: "",
            });
        }
    };

    const agregarAfiliacion = () => {
        if (
            afiliacionActual.tipoAfiliacion &&
            afiliacionActual.nombreEntidad &&
            afiliacionActual.fechaAfiliacion
        ) {
            setAfiliaciones([...afiliaciones, { ...afiliacionActual }]);
            setAfiliacionActual({
                tipoAfiliacion: "",
                nombreEntidad: "",
                fechaAfiliacion: ""
            });
        }
    };

    const limpiarFormulario = () => {
        setEmpleado({
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
            cargo: "",
        });
        setContrato({
            fechaIngreso: "",
        });
        setFamiliarActual({
            tipoFamiliar: "",
            nombreFamiliar: "",
            edadFamiliar: ""
        });
        setFamiliares([]);

        setCursoActual({
            tipoCurso: "",
            categoria: "",
            fechaCurso: ""
        });
        setCursos([]);

        setEstudioActual({
            tipoEstudio: "",
            nombreEstudio: "",
            fechaEstudio: ""
        });
        setEstudios([]);

        setExperienciaLaboralActual({
            descripcionExperiencia: ""
        });
        setExperienciasLaborales([]);

        setAfiliacionActual({
            tipoAfiliacion: "",
            nombreEntidad: "",
            fechaAfiliacion: ""
        });
        setAfiliaciones([]);
    };
    const eliminarFamiliarTabla = (index) => {
        const nuevosFamiliares = [...familiares];
        nuevosFamiliares.splice(index, 1);
        setFamiliares(nuevosFamiliares);
    };
    const eliminarCursoTabla = (index) => {
        const nuevosCursos = [...cursos];
        nuevosCursos.splice(index, 1);
        setCursos(nuevosCursos);
    };
    const eliminarEstudioTabla = (index) => {
        const nuevosEstudios = [...estudios];
        nuevosEstudios.splice(index, 1);
        setEstudios(nuevosEstudios);
    };
    const eliminarExperienciaLaboralTabla = (index) => {
        const nuevasExperienciasLaborales = [...experienciasLaborales];
        nuevasExperienciasLaborales.splice(index, 1);
        setExperienciasLaborales(nuevasExperienciasLaborales);
    };
    const eliminarAfiliacionTabla = (index) => {
        const nuevasAfiliaciones = [...afiliaciones];
        nuevasAfiliaciones.splice(index, 1);
        setAfiliaciones(nuevasAfiliaciones);
    };

    return (
        <div>
            <h3 className='alinearTexto'>Formulario de Registro de Empleados</h3>
            <div className='row align-items-center g-2'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Nombres:"
                    tipoinput="text"
                    nombreinput="nombres"
                    idinput="nombres"
                    placeholderinput="Ingrese los nombres"
                    value={empleado.nombres}
                    onChange={(e) => setEmpleado({ ...empleado, nombres: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Apellidos:"
                    tipoinput="text"
                    nombreinput="apellidos"
                    idinput="apellidos"
                    placeholderinput="Ingrese los apellidos"
                    value={empleado.apellidos}
                    onChange={(e) => setEmpleado({ ...empleado, apellidos: e.target.value })}
                />
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Tipo Documento:"
                    nombreinput="tipoDocumento"
                    idinput="tipoDocumento"
                    value={empleado.tipoDocumento}
                    onChange={(e) => setEmpleado({ ...empleado, tipoDocumento: e.target.value })}
                    opciones={[
                        { valor: "CC", texto: "CÉDULA DE CIUDADANÍA (CC)" },
                        { valor: "CE", texto: "CÉDULA DE EXTRANJERÍA (CE)" },
                        { valor: "TI", texto: "TARJETA DE IDENTIDAD (TI)" },
                        { valor: "PPT", texto: "PERMISO DE PERMANENCIA (PPT)" },
                    ]}
                />
            </div>

            <div className='row align-items-center g-2'>
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Número Documento:"
                    tipoinput="number"
                    nombreinput="numeroDocumento"
                    idinput="numeroDocumento"
                    placeholderinput="Ingrese el número de documento"
                    value={empleado.numeroDocumento}
                    onChange={(e) => setEmpleado({ ...empleado, numeroDocumento: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Fecha de Nacimiento:"
                    tipoinput="date"
                    nombreinput="fechaNacimiento"
                    idinput="fechaNacimiento"
                    placeholderinput="Seleccione la fecha de nacimiento"
                    value={empleado.fechaNacimiento}
                    onChange={(e) => setEmpleado({ ...empleado, fechaNacimiento: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Lugar de Nacimiento:"
                    tipoinput="text"
                    nombreinput="lugarNacimiento"
                    idinput="lugarNacimiento"
                    placeholderinput="Ingrese el lugar de nacimiento"
                    value={empleado.lugarNacimiento}
                    onChange={(e) => setEmpleado({ ...empleado, lugarNacimiento: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-3"
                    titulolabel="Ciudad de expedición:"
                    tipoinput="text"
                    nombreinput="ciudadExpedicion"
                    idinput="ciudadExpedicion"
                    placeholderinput="Ingrese la ciudad de expedición del documento"
                    value={empleado.ciudadExpedicion}
                    onChange={(e) => setEmpleado({ ...empleado, ciudadExpedicion: e.target.value })}
                />
            </div>

            <div className='row align-items-center g-2'>
                <CuadrosSelect
                    tamanoinput="col-md-3"
                    titulolabel="Libreta Militar:"
                    nombreinput="libretaMilitar"
                    idinput="libretaMilitar"
                    value={empleado.libretaMilitar}
                    onChange={(e) => setEmpleado({ ...empleado, libretaMilitar: e.target.value })}
                    opciones={[
                        { valor: "PRIMERA", texto: "PRIMERA CLASE" },
                        { valor: "SEGUNDA", texto: "SEGUNDA CLASE" },
                        { valor: "NO_TIENE", texto: "NO TIENE" },
                    ]}
                />
                <CuadrosSelect
                    tamanoinput="col-md-3"
                    titulolabel="Estado Civil:"
                    nombreinput="estadoCivil"
                    idinput="estadoCivil"
                    value={empleado.estadoCivil}
                    onChange={(e) => setEmpleado({ ...empleado, estadoCivil: e.target.value })}
                    opciones={[
                        { valor: "CASADO", texto: "CASADO(A)" },
                        { valor: "SOLTERO", texto: "SOLTERO(A)" },
                        { valor: "VIUDO", texto: "VIUDO(A)" },
                        { valor: "SEPARADO", texto: "SEPARADO(A)" },
                        { valor: "UNION_LIBRE", texto: "UNIÓN LIBRE" },
                    ]}
                />
                <CuadrosSelect
                    tamanoinput="col-md-3"
                    titulolabel="GÉNERO:"
                    nombreinput="genero"
                    idinput="genero"
                    value={empleado.genero}
                    onChange={(e) => setEmpleado({ ...empleado, genero: e.target.value })}
                    opciones={[
                        { valor: "MASCULINO", texto: "MASCULINO" },
                        { valor: "FEMENINO", texto: "FEMENINO" },
                    ]}
                />

            </div>

            <h5 className='alinearTexto'>Datos de Contacto</h5>

            <div className='row align-items-center g-2'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Dirección:"
                    tipoinput="text"
                    nombreinput="direccion"
                    idinput="direccion"
                    placeholderinput="Ingrese la dirección"
                    value={empleado.direccion}
                    onChange={(e) => setEmpleado({ ...empleado, direccion: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Teléfono:"
                    tipoinput="number"
                    nombreinput="telefono"
                    idinput="telefono"
                    placeholderinput="Ingrese el número telefónico"
                    value={empleado.telefono}
                    onChange={(e) => setEmpleado({ ...empleado, telefono: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Correo Electrónico:"
                    tipoinput="email"
                    nombreinput="correo"
                    idinput="correo"
                    placeholderinput="Ingrese el correo electróncio"
                    value={empleado.correo}
                    onChange={(e) => setEmpleado({ ...empleado, correo: e.target.value })}
                />
            </div>
            <br></br>
            <h5 className='alinearTexto'>Hijos Hijastros</h5>

            <div className='row align-items-center g-2'>
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Tipo de Familiar:"
                    nombreinput="tipoFamiliar"
                    idinput="tipoFamiliar"
                    value={familiarActual.tipoFamiliar}
                    onChange={(e) =>
                        setFamiliarActual({ ...familiarActual, tipoFamiliar: e.target.value })
                    }
                    opciones={[
                        { valor: "HIJOS", texto: "HIJOS" },
                        { valor: "HIJASTROS", texto: "HIJASTROS" }
                    ]}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Nombres y Apellidos:"
                    tipoinput="text"
                    nombreinput="nombreFamiliar"
                    idinput="nombreFamiliar"
                    placeholderinput="Ingresa el nombre del familiar"
                    value={familiarActual.nombreFamiliar}
                    onChange={(e) =>
                        setFamiliarActual({ ...familiarActual, nombreFamiliar: e.target.value })
                    }
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Edad (años):"
                    tipoinput="number"
                    nombreinput="edadFamiliar"
                    idinput="edadFamiliar"
                    placeholderinput="Edad Familiar"
                    value={familiarActual.edadFamiliar}
                    onChange={(e) =>
                        setFamiliarActual({ ...familiarActual, edadFamiliar: e.target.value })
                    }
                />
            </div>

            <button type="button"
                className="btn btn-secondary mb-4"
                onClick={agregarFamiliar}
            >
                Agregar HIJO/HIJASTRO
            </button>
            <br />
            {familiares.length > 0 && (
                <div>
                    <h5>Familiares Registrados:</h5>
                    <table className="table table-bordered border-black">
                        <thead className="table-primary border-black">
                            <tr>
                                <th>Tipo</th>
                                <th>Nombre</th>
                                <th>Edad</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {familiares.map((f, idx) => (
                                <tr key={idx}>
                                    <td>{f.tipoFamiliar}</td>
                                    <td>{f.nombreFamiliar}</td>
                                    <td>{f.edadFamiliar}</td>
                                    <td><button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => eliminarFamiliarTabla(idx)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h5 className='alinearTexto'>Cursos de Vigilancia</h5>

            <div className='row align-items-center g-2'>
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Tipo de Curso:"
                    nombreinput="tipoCurso"
                    idinput="tipoCurso"
                    value={cursoActual.tipoCurso}
                    onChange={(e) =>
                        setCursoActual({ ...cursoActual, tipoCurso: e.target.value })
                    }
                    opciones={[
                        { valor: "FUNDAMENTACION", texto: "FUNDAMENTACION" },
                        { valor: "REENTRENAMIENTO", texto: "REENTRENAMIENTO" },
                    ]}
                />
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Categoria:"
                    nombreinput="categoria"
                    idinput="categoria"
                    value={cursoActual.categoria}
                    onChange={(e) =>
                        setCursoActual({ ...cursoActual, categoria: e.target.value })
                    }
                    opciones={[
                        { valor: "GUARDA_DE_SEGURIDAD", texto: "GUARDA DE SEGURIDAD" },
                        { valor: "MANEJADOR_CANINO", texto: "MANEJADOR CANINO" },
                        { valor: "SUPERVISOR", texto: "SUPERVISOR" },
                        { valor: "OPERADOR_DE_MEDIOS", texto: "OPERADOR DE MEDIOS" },
                        { valor: "ESCOLTA", texto: "ESCOLTA" },
                    ]}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha del Curso:"
                    tipoinput="date"
                    nombreinput="fechaCurso"
                    idinput="fechaCurso"
                    value={cursoActual.fechaCurso}
                    onChange={(e) =>
                        setCursoActual({ ...cursoActual, fechaCurso: e.target.value })
                    }
                />
            </div>
            <button type="button"
                className="btn btn-secondary mb-4"
                onClick={agregarCurso}
            >
                Agregar Curso
            </button>
            <br />
            {cursos.length > 0 && (
                <div>
                    <h5>Cursos Registrados:</h5>
                    <table className="table table-bordered border-black">
                        <thead className="table-primary border-black">
                            <tr>
                                <th>Tipo de Curso</th>
                                <th>Categoria</th>
                                <th>Fecha del Curso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.map((c, idx) => (
                                <tr key={idx}>
                                    <td>{c.tipoCurso}</td>
                                    <td>{c.categoria}</td>
                                    <td>{c.fechaCurso}</td>
                                    <td><button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => eliminarCursoTabla(idx)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h5 className='alinearTexto'>Estudios</h5>

            <div className='row align-items-center g-2'>
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Tipo de Estudio:"
                    nombreinput="tipoEstudio"
                    idinput="tipoEstudio"
                    value={estudioActual.tipoEstudio}
                    onChange={(e) =>
                        setEstudioActual({ ...estudioActual, tipoEstudio: e.target.value })
                    }
                    opciones={[
                        { valor: "BACHILLER_ACADEMICO", texto: "BACHILLER ACADÉMICO" },
                        { valor: "TECNICO", texto: "TECNICO" },
                        { valor: "OTRO", texto: "OTRO" },
                    ]}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Descripción (Título):"
                    tipoinput="text"
                    nombreinput="nombreEstudio"
                    idinput="nombreEstudio"
                    value={estudioActual.nombreEstudio}
                    onChange={(e) =>
                        setEstudioActual({ ...estudioActual, nombreEstudio: e.target.value })
                    }
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha de Realización:"
                    tipoinput="date"
                    nombreinput="fechaEstudio"
                    idinput="fechaEstudio"
                    value={estudioActual.fechaEstudio}
                    onChange={(e) =>
                        setEstudioActual({ ...estudioActual, fechaEstudio: e.target.value })
                    }
                />
            </div>
            <button type="button"
                className="btn btn-secondary mb-4"
                onClick={agregarEstudio}
            >
                Agregar Estudio
            </button>

            {estudios.length > 0 && (
                <div>
                    <h5>Estudios Registrados:</h5>
                    <table className="table table-bordered border-black">
                        <thead className="table-primary border-black">
                            <tr>
                                <th>Tipo de Estudio</th>
                                <th>Descripción (Título)</th>
                                <th>Fecha de Realización</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {estudios.map((e, idx) => (
                                <tr key={idx}>
                                    <td>{e.tipoEstudio}</td>
                                    <td>{e.nombreEstudio}</td>
                                    <td>{e.fechaEstudio}</td>
                                    <td><button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => eliminarEstudioTabla(idx)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h5 className='alinearTexto'>Experiencia Laboral</h5>

            <div className='row align-items-center g-2'>

                <CuadrosTexto
                    tamanoinput="col-md-8"
                    titulolabel="Experiencia Laboral:"
                    tipoinput="text"
                    nombreinput="descripcionExperiencia"
                    idinput="descripcionExperiencia"
                    value={experienciaLaboralActual.descripcionExperiencia}
                    onChange={(e) =>
                        setExperienciaLaboralActual({ ...experienciaLaboralActual, descripcionExperiencia: e.target.value })
                    }
                />
            </div>
            
            <button type="button"
                className="btn btn-secondary mb-4"
                onClick={agregarExperienciaLaboral}
            >
                Agregar Experiencia Laboral
            </button>

            {experienciasLaborales.length > 0 && (
                <div>
                    <h5>Experiencia Laboral Registradas:</h5>
                    <table className="table table-bordered border-black">
                        <thead className="table-primary border-black">
                            <tr>
                                <th>Descripción Experiencia Laboral</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {experienciasLaborales.map((ex, idx) => (
                                <tr key={idx}>
                                    <td>{ex.descripcionExperiencia}</td>
                                    <td><button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => eliminarExperienciaLaboralTabla(idx)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h5 className='alinearTexto'>Afiliaciones</h5>

            <div className='row align-items-center g-2'>
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Tipo de Afiliación:"
                    nombreinput="tipoAfiliacion"
                    idinput="tipoAfiliacion"
                    value={afiliacionActual.tipoAfiliacion}
                    onChange={(e) =>
                        setAfiliacionActual({ ...afiliacionActual, tipoAfiliacion: e.target.value })
                    }
                    opciones={[
                        { valor: "SALUD", texto: "SALUD" },
                        { valor: "PENSION", texto: "PENSIÓN" },
                        { valor: "ARL", texto: "ARL" },
                    ]}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Nombre de la Entidad:"
                    tipoinput="text"
                    nombreinput="nombreEntidad"
                    idinput="nombreEntidad"
                    value={afiliacionActual.nombreEntidad}
                    onChange={(e) =>
                        setAfiliacionActual({ ...afiliacionActual, nombreEntidad: e.target.value })
                    }
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha de Afiliación:"
                    tipoinput="date"
                    nombreinput="fechaAfiliacion"
                    idinput="fechaAfiliacion"
                    value={afiliacionActual.fechaAfiliacion}
                    onChange={(e) =>
                        setAfiliacionActual({ ...afiliacionActual, fechaAfiliacion: e.target.value })
                    }
                />
            </div>
            <button type="button"
                className="btn btn-secondary mb-4"
                onClick={agregarAfiliacion}
            >
                Agregar Afiliación
            </button>

            {afiliaciones.length > 0 && (
                <div>
                    <h4>Afiliaciones Registradas:</h4>
                    <table className="table table-bordered border-black">
                        <thead className="table-primary border-black">
                            <tr>
                                <th>Tipo de Afiliación</th>
                                <th>Nombre de la Entidad</th>
                                <th>Fecha de Afiliación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {afiliaciones.map((af, idx) => (
                                <tr key={idx}>
                                    <td>{af.tipoAfiliacion}</td>
                                    <td>{af.nombreEntidad}</td>
                                    <td>{af.fechaAfiliacion}</td>
                                    <td><button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => eliminarAfiliacionTabla(idx)}
                                        title="Eliminar"
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h5 className='alinearTexto'>Asignar Cargo</h5>

            <div className='row align-items-center g-2'>
                <CuadrosSelect
                    tamanoinput="col-md-4"
                    titulolabel="Tipo de Empleado:"
                    nombreinput="tipoEmpleado"
                    idinput="tipoEmpleado"
                    value={empleado.tipoEmpleado}
                    onChange={(e) => setEmpleado({ ...empleado, tipoEmpleado: e.target.value })}
                    opciones={[
                        { valor: "OPERATIVO", texto: "OPERATIVO" },
                        { valor: "ADMINISTRATIVO", texto: "ADMINISTRATIVO" },
                    ]}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Cargo a Desempeñar:"
                    tipoinput="text"
                    nombreinput="cargo"
                    idinput="cargo"
                    placeholderinput="Ingrese el cargo a ocupar"
                    value={empleado.cargo}
                    onChange={(e) => setEmpleado({ ...empleado, cargo: e.target.value })}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha de Ingreso:"
                    tipoinput="date"
                    nombreinput="fechaIngreso"
                    idinput="fechaIngreso"
                    value={contrato.fechaIngreso}
                    onChange={(e) => setContrato({ ...contrato, fechaIngreso: e.target.value })}
                />
            </div>

            <br />
            <div className='col-md-auto'>
                <button
                    onClick={() => AgregarTabla(
                        contrato, 
                        familiares, 
                        cursos, 
                        estudios, 
                        experienciasLaborales, 
                        afiliaciones, 
                        empleado, 
                        limpiarFormulario)}
                    className="botonregistrar btn btn-success"
                >
                    Registrar
                </button>
            </div>
        </div>
    )
};
import { CuadrosTexto } from "./CuadrosTexto";
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
    })

    const [contrato, setContrato] = useState({
        fechaIngreso: ""
    });

    return (
        <div>
            <h1 className='alinearTexto'>Formulario de Registro de Empleados <strong>Vigitecol Ltda.</strong></h1>
            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Nombres:"
                    tipoinput="text"
                    nombreinput="nombres"
                    idinput="nombres"
                    placeholderinput="Ingrese los nombres"
                    value={empleado.nombres}
                    onChange={(e) => setEmpleado({ ...empleado, nombres: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Apellidos:"
                    tipoinput="text"
                    nombreinput="apellidos"
                    idinput="apellidos"
                    placeholderinput="Ingrese los apellidos"
                    value={empleado.apellidos}
                    onChange={(e) => setEmpleado({ ...empleado, apellidos: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Tipo Documento:"
                    tipoinput="text"
                    nombreinput="tipoDocumento"
                    idinput="tipoDocumento"
                    placeholderinput="Seleccione el tipo de documento"
                    value={empleado.tipoDocumento}
                    onChange={(e) => setEmpleado({ ...empleado, tipoDocumento: e.target.value})}
                />
            </div>

            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Número Documento:"
                    tipoinput="number"
                    nombreinput="numeroDocumento"
                    idinput="numeroDocumento"
                    placeholderinput="Ingrese el número de documento"
                    value={empleado.numeroDocumento}
                    onChange={(e) => setEmpleado({ ...empleado, numeroDocumento: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha de Nacimiento:"
                    tipoinput="date"
                    nombreinput="fechaNacimiento"
                    idinput="fechaNacimiento"
                    placeholderinput="Seleccione la fecha de nacimiento"
                    value={empleado.fechaNacimiento}
                    onChange={(e) => setEmpleado({ ...empleado, fechaNacimiento: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Lugar de Nacimiento:"
                    tipoinput="text"
                    nombreinput="lugarNacimiento"
                    idinput="lugarNacimiento"
                    placeholderinput="Ingrese el lugar de nacimiento"
                    value={empleado.lugarNacimiento}
                    onChange={(e) => setEmpleado({ ...empleado, lugarNacimiento: e.target.value})}
                />
            </div>

            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Ciudad de expedición del documento:"
                    tipoinput="text"
                    nombreinput="ciudadExpedicion"
                    idinput="ciudadExpedicion"
                    placeholderinput="Ingrese la ciudad de expedición del documento"
                    value={empleado.ciudadExpedicion}
                    onChange={(e) => setEmpleado({ ...empleado, ciudadExpedicion: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Libreta Militar:"
                    tipoinput="text"
                    nombreinput="libretaMilitar"
                    idinput="libretaMilitar"
                    placeholderinput="Seleccione su estado"
                    value={empleado.libretaMilitar}
                    onChange={(e) => setEmpleado({ ...empleado, libretaMilitar: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Estado Civil:"
                    tipoinput="text"
                    nombreinput="estadoCivil"
                    idinput="estadoCivil"
                    placeholderinput="Seleccione su estado civil"
                    value={empleado.estadoCivil}
                    onChange={(e) => setEmpleado({ ...empleado, estadoCivil: e.target.value})}
                />
            </div>

            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Género:"
                    tipoinput="text"
                    nombreinput="genero"
                    idinput="genero"
                    placeholderinput="Seleccione el tipo de genero"
                    value={empleado.genero}
                    onChange={(e) => setEmpleado({ ...empleado, genero: e.target.value})}
                />
            </div>

            <h3 className='alinearTexto'>Datos de Contacto</h3>

            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Dirección:"
                    tipoinput="text"
                    nombreinput="direccion"
                    idinput="direccion"
                    placeholderinput="Ingrese la dirección"
                    value={empleado.direccion}
                    onChange={(e) => setEmpleado({ ...empleado, direccion: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Teléfono:"
                    tipoinput="number"
                    nombreinput="telefono"
                    idinput="telefono"
                    placeholderinput="Ingrese el número telefónico"
                    value={empleado.telefono}
                    onChange={(e) => setEmpleado({ ...empleado, telefono: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Correo Electrónico:"
                    tipoinput="email"
                    nombreinput="correo"
                    idinput="correo"
                    placeholderinput="Ingrese el correo electróncio"
                    value={empleado.correo}
                    onChange={(e) => setEmpleado({ ...empleado, correo: e.target.value})}
                />
            </div>
            <br></br>
            <h3 className='alinearTexto'>Asignar Cargo</h3>

            <div className='row'>
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Tipo de Empleado:"
                    tipoinput="text"
                    nombreinput="tipoEmpleado"
                    idinput="tipoEmpleado"
                    placeholderinput="Seleccione el tipo de empleado"
                    value={empleado.tipoEmpleado}
                    onChange={(e) => setEmpleado({ ...empleado, tipoEmpleado: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Cargo:"
                    tipoinput="text"
                    nombreinput="cargo"
                    idinput="cargo"
                    placeholderinput="Ingrese el cargo a ocupar"
                    value={empleado.cargo}
                    onChange={(e) => setEmpleado({ ...empleado, cargo: e.target.value})}
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha de Ingreso:"
                    tipoinput="date"
                    nombreinput="fechaIngreso"
                    idinput="fechaIngreso"
                    value={contrato.fechaIngreso}
                    onChange={(e) => setContrato({ ...contrato, fechaIngreso: e.target.value})}
                />
            
            </div>

            <br /><br />
            <div className='col-md-auto'>
                <button
                    onClick={() => AgregarTabla(contrato)}
                    className="botonregistrar btn btn-success"
                >
                    Registrar
                </button>
            </div>
        </div>
    )
};
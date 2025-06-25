import { CuadrosTexto } from "./CuadrosTexto";
import { AgregarTabla } from "./AgregarTabla";

export function Formulario() {
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
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Apellidos:"
                    tipoinput="text"
                    nombreinput="apellidos"
                    idinput="apellidos"
                    placeholderinput="Ingrese los apellidos"
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Tipo Documento:"
                    tipoinput="text"
                    nombreinput="tipoDocumento"
                    idinput="tipoDocumento"
                    placeholderinput="Seleccione el tipo de documento"
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
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Fecha de Nacimiento:"
                    tipoinput="date"
                    nombreinput="fechaNacimiento"
                    idinput="fechaNacimiento"
                    placeholderinput="Seleccione la fecha de nacimiento"
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Lugar de Nacimiento:"
                    tipoinput="text"
                    nombreinput="lugarNacimiento"
                    idinput="lugarNacimiento"
                    placeholderinput="Ingrese el lugar de nacimiento"
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
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Libreta Militar:"
                    tipoinput="text"
                    nombreinput="libretaMilitar"
                    idinput="libretaMilitar"
                    placeholderinput="Seleccione su estado"
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Estado Civil:"
                    tipoinput="text"
                    nombreinput="estadoCivil"
                    idinput="estadoCivil"
                    placeholderinput="Seleccione su estado civil"
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
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Teléfono:"
                    tipoinput="number"
                    nombreinput="telefono"
                    idinput="telefono"
                    placeholderinput="Ingrese el número telefónico"
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Correo Electrónico:"
                    tipoinput="email"
                    nombreinput="correo"
                    idinput="correo"
                    placeholderinput="Ingrese el correo electróncio"
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
                />
                <CuadrosTexto
                    tamanoinput="col-md-4"
                    titulolabel="Cargo:"
                    tipoinput="text"
                    nombreinput="cargo"
                    idinput="cargo"
                    placeholderinput="Ingrese el cargo a ocupar"
                />
            </div>
            <br></br>
            <button onClick={AgregarTabla} className='botonregistrar btn btn-success'>Registrar</button>
            <br></br>
        </div>
    )
};
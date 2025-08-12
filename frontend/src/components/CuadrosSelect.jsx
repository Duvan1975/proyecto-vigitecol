export function CuadrosSelect({
    tamanoinput,
    titulolabel,
    nombreinput,
    idinput,
    value,
    onChange, 
    opciones = []
}) {
    return (
        <div className={`${tamanoinput} mb-2`}>
            <label htmlFor={titulolabel}className="form-label"><strong>{titulolabel}</strong></label>
            <select name={nombreinput}
                id={idinput}
                className="form-control"
                value={value}
                onChange={onChange}
                style={{ height: '38px' }}
            >
                <option value="">Seleccione</option>
                {opciones.map((opcion) => (
                    <option key={opcion.valor} value={opcion.valor}>
                        {opcion.texto}
                    </option>
                ))}
            </select>
        </div>
    )
}
export function CuadrosTexto({
  tamanoinput,
  titulolabel,
  tipoinput,
  nombreinput,
  idinput,
  placeholderinput,
  value,
  onChange,
  required
}) {
  return (
    <div className={tamanoinput}>
      <label htmlFor={idinput}>
        <strong>
          {required && <span className="text-danger">*</span>} {titulolabel} 
        </strong>
      </label>
      <input
        type={tipoinput}
        name={nombreinput}
        id={idinput}
        placeholder={placeholderinput}
        className="form-control"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}
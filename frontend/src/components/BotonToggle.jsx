import { useState } from "react";

function BotonToggle({ target, texto }) {
    const [abierto, setAbierto] = useState(false);

    const toggle = () => setAbierto(!abierto);

    return (
        <button
            className="btn btn-outline-secondary me-2 d-flex align-items-center gap-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={target}
            aria-expanded={abierto}
            aria-controls={target.replace("#", "")}
            onClick={toggle}
        >
            <i className={`bi ${abierto ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
            {abierto ? `Ocultar ${texto}` : `Mostrar ${texto}`}
        </button>
    );
}

export default BotonToggle;

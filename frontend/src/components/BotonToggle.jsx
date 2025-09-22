import { useState, useEffect } from "react";

function BotonToggle({ target, texto }) {
    const [abierto, setAbierto] = useState(false);

    const toggle = () => setAbierto(!abierto);

    useEffect(() => {
        // Inicializar tooltips de Bootstrap
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        [...tooltipTriggerList].map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));
    }, []);

    return (
        <button
            className="btn btn-outline-secondary me-2 d-flex align-items-center"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={target}
            aria-expanded={abierto}
            aria-controls={target.replace("#", "")}
            onClick={toggle}
            data-bs-placement="top"
            title={abierto ? `Ocultar ${texto}` : `Mostrar ${texto}`}
        >
            <i className={`bi ${abierto ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
        </button>
    );
}

export default BotonToggle;

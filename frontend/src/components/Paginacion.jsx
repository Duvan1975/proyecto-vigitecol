import React from "react";

const Paginacion = ({ totalPaginas, paginaActual, onChange }) => {
    console.log("Renderizando paginación:", totalPaginas, "páginas");

    if (totalPaginas <= 1) return null;

    const mostrarPaginas = 5; // Número máximo de botones de página a mostrar
    let inicio = 0;
    let fin = totalPaginas - 1;

    // Calcular qué páginas mostrar
    if (totalPaginas > mostrarPaginas) {
        inicio = Math.max(0, paginaActual - Math.floor(mostrarPaginas / 2));
        fin = Math.min(totalPaginas - 1, inicio + mostrarPaginas - 1);
        
        // Ajustar si estamos cerca del final
        if (fin - inicio + 1 < mostrarPaginas) {
            inicio = Math.max(0, fin - mostrarPaginas + 1);
        }
    }

    const paginas = [];
    for (let i = inicio; i <= fin; i++) {
        paginas.push(i);
    }

    return (
        <div className="d-flex justify-content-center align-items-center mt-3">
            {/* Botón Primera Página */}
            <button
                className="btn btn-outline-primary btn-sm mx-1"
                onClick={() => onChange(0)}
                disabled={paginaActual === 0}
                title="Primera página"
            >
                ««
            </button>

            {/* Botón Anterior */}
            <button
                className="btn btn-outline-primary btn-sm mx-1"
                onClick={() => onChange(paginaActual - 1)}
                disabled={paginaActual === 0}
                title="Página anterior"
            >
                «
            </button>

            {/* Mostrar puntos suspensivos si hay páginas antes */}
            {inicio > 0 && (
                <span className="mx-1">...</span>
            )}

            {/* Botones de páginas */}
            {paginas.map((pagina) => (
                <button
                    key={pagina}
                    className={`btn btn-sm mx-1 ${
                        pagina === paginaActual ? "btn-primary" : "btn-outline-primary"
                    }`}
                    onClick={() => onChange(pagina)}
                >
                    {pagina + 1}
                </button>
            ))}

            {/* Mostrar puntos suspensivos si hay páginas después */}
            {fin < totalPaginas - 1 && (
                <span className="mx-1">...</span>
            )}

            {/* Botón Siguiente */}
            <button
                className="btn btn-outline-primary btn-sm mx-1"
                onClick={() => onChange(paginaActual + 1)}
                disabled={paginaActual === totalPaginas - 1}
                title="Página siguiente"
            >
                »
            </button>

            {/* Botón Última Página */}
            <button
                className="btn btn-outline-primary btn-sm mx-1"
                onClick={() => onChange(totalPaginas - 1)}
                disabled={paginaActual === totalPaginas - 1}
                title="Última página"
            >
                »»
            </button>
        </div>
    );
};

export default Paginacion;
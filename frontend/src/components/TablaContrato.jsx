import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";

export function TablaContrato() {
    const [empleadosConContratos, setEmpleadosConContratos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(3);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEmpleadosConContratos(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarEmpleadosConContratos = (pagina = 0) => {
        setCargando(true);

        fetch(`http://localhost:8080/contratos?page=${pagina}`)
            .then((res) => res.json())
            .then((data) => {
                setEmpleadosConContratos(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar empleados con contratos:", error);
                setCargando(false);
            });
    };
    if (cargando) {
        return <p>Cargando listado...</p>;
    }
    if (empleadosConContratos.length === 0) {
        return <p className="text-center text-muted">No hay empleados con registros.</p>;
    }
    return (
        <div>
            <h4 className="mb-3 alinearTexto">LISTADO DE PERSONAL CON CONTRATO</h4>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />
            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por página,
                    total de registros: {totalElementos}
                </small>
            </div>

            <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Documento</th>
                        <th>Fecha de Ingreso</th>
                        <th>N° Contrato</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosConContratos.map((contrato) => (
                        <tr key={contrato.id}>
                            <td>{contrato.nombreEmpleado}</td>
                            <td>{contrato.apellidoEmpleado}</td>
                            <td>{contrato.documentoEmpleado}</td>
                            <td>{contrato.fechaIngreso}</td>
                            <td>{contrato.numeroContrato}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />
            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por página,
                    total de registros: {totalElementos}
                </small>
            </div>
        </div>
    );
}
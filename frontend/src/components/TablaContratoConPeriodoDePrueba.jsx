import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import Paginacion from "./Paginacion";

export function TablaContratoConPeriodoDePrueba() {
    const [empleadosConPeriodoDePrueba, setEmpleadosConPeriodoDePrueba] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEmpleadosConPeriodoDePrueba(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarEmpleadosConPeriodoDePrueba = (pagina = 0) => {
        setCargando(true);

        authFetch(`http://localhost:8080/empleados/periodo-prueba/vencido?page=${pagina}`, {
            headers: {

            },
        })
            .then((res) => res.json())
            .then((data) => {
                setEmpleadosConPeriodoDePrueba(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar empleados en periodo de prueba:", error);
                setCargando(false);
            });
    };
    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    if (empleadosConPeriodoDePrueba.length === 0) {
        return <p className="text-center text-muted">No hay empleados en periodo de prueba a vencer.</p>;
    }

    return (
        <div>
            <h4 className="alinearTexto">Listado Personal en Periodo de Prueba</h4>
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
                        <th>Número Documento</th>
                        <th>Teléfono</th>
                        <th>Cargo</th>
                        <th>N° Contrato</th>
                        <th>Fecha de Ingreso</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosConPeriodoDePrueba.map((empleado) =>
                        empleado.contratoPeriodoDePrueba.map((contrato, index) => (
                            <tr key={`${empleado.id}-${index}`}>
                                <td>{empleado.nombres}</td>
                                <td>{empleado.apellidos}</td>
                                <td>{empleado.numeroDocumento}</td>
                                <td>{empleado.telefono}</td>
                                <td>{empleado.cargo}</td>
                                <td>{contrato.numeroContrato}</td>
                                <td>{contrato.fechaIngreso}</td>
                            </tr>
                        ))
                    )}
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
    )
}
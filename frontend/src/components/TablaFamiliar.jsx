import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";

export function TablaFamiliar({ tipoEmpleado, titulo, genero }) {
    const [empleadosConFamiliares, setEmpleadosConFamiliares] = useState([]);

    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);

    const [totalFamiliares, setTotalFamiliares] = useState(0);

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEmpleadosConFamiliares(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    useEffect(() => {
        setPaginaActual();
    }, [genero, tipoEmpleado]);


    const cargarEmpleadosConFamiliares = (pagina = 0) => {
        setCargando(true);

        let url = genero
            ? `http://localhost:8080/empleados/conFamiliares/genero?genero=${genero}&page=${pagina}`
            : `http://localhost:8080/empleados/con-familiares-menores?page=${pagina}`;

        if (tipoEmpleado) {
            url += `&tipoEmpleado=${tipoEmpleado}`;
        }

        fetch(url, {
            headers: {

            },
        })
            .then((res) => res.json())
            .then((data) => {
                const totalFamiliares = data.content.reduce(
                    (sum, empleado) => sum + empleado.numeroDeFamiliares,
                    0
                );
                setEmpleadosConFamiliares(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setTotalFamiliares(totalFamiliares);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar personas con familiares:", error);
                setCargando(false);
            });
    };

    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    if (empleadosConFamiliares.length === 0) {
        return <p className="text-center text-muted">No hay personal con hijos o hijastros registrados.</p>;
    }

    return (
        <div>
            <h4 className="alinearTexto">{titulo} total hijos/hijastros: {totalFamiliares}</h4>
            <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                totalFamiliares={totalFamiliares}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />
            <div className="mt-2 text-center">
                <small>
                    Mostrando página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por página,
                    total de registros: {totalElementos} | total hijos/hijastros: {totalFamiliares}
                </small>
            </div>
            <table className="table table-bordered table-hover table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Nombres</th>
                        <th>Apellidos</th>
                        <th>Número Documento</th>
                        <th>Edad</th>
                        <th>Teléfono</th>
                        <th>Cargo</th>
                        <th>Cantidad</th>
                        <th>Hijos/Hijastros</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosConFamiliares.map((empleado) => (
                        <tr key={empleado.id}>
                            <td>{empleado.nombres}</td>
                            <td>{empleado.apellidos}</td>
                            <td>{empleado.numeroDocumento}</td>
                            <td>{empleado.edad}</td>
                            <td>{empleado.telefono}</td>
                            <td>{empleado.cargo}</td>
                            <td className="text-center">{empleado.numeroDeFamiliares}</td>
                            <td>
                                <ul className="mb-0 ps-3">
                                    {empleado.familiares.map((f, index) => (
                                        <li key={index}>
                                            <strong>{f.tipoFamiliar}</strong>: {f.nombreFamiliar} ({f.edadFamiliar} años)
                                        </li>
                                    ))}
                                </ul>
                            </td>
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
    )
} 

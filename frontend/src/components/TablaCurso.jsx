import { useEffect, useState } from "react";
import Paginacion from "./Paginacion";
import { authFetch } from "../utils/authFetch";

export function TablaCurso() {
    const [empleadosConCursosPorVencer, setEmpleadosConCursosPorVencer] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        cargarEmpleadosConCursosPorVencer(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual]);

    const cargarEmpleadosConCursosPorVencer = (pagina = 0) => {
        setCargando(true);

        authFetch(`http://localhost:8080/empleados/con-cursos/por-vencer?page=${pagina}`, {
            headers: {

            },
        })
            .then((res) => res.json())
            .then((data) => {
                setEmpleadosConCursosPorVencer(data.content);
                setPaginaActual(data.number);
                setTotalPaginas(data.totalPages);
                setTotalElementos(data.totalElements);
                setTamanoPagina(data.size);
                setCargando(false);
            })
            .catch((error) => {
                console.error("Error al cargar empleados con cursos:", error);
                setCargando(false);
            });
    };
    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    if (empleadosConCursosPorVencer.length === 0) {
        return <p className="text-center text-muted">No hay empleados con cursos por vencer.</p>;
    }

    return (
        <div>
            <h4 className="alinearTexto">PERSONAL OPERATIVO CON CURSOS POR VENCER O VENCIDOS (total = {totalElementos})</h4>
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
                        <th>Curso Próximo a Vencer</th>
                    </tr>
                </thead>
                <tbody>
                    {empleadosConCursosPorVencer
                        .filter((empleado) => empleado.cursosVigentes.length > 0) // 🔥 solo empleados con cursos
                        .map((empleado) => (
                            <tr key={empleado.id} className={empleado.cursosVigentes.some(c => c.vencido) ? "table-danger" : ""}>
                                <td>{empleado.nombres}</td>
                                <td>{empleado.apellidos}</td>
                                <td>{empleado.numeroDocumento}</td>
                                <td>{empleado.telefono}</td>
                                <td>{empleado.cargo}</td>
                                <td>
                                    <ul className="mb-0 ps-3">
                                        {empleado.cursosVigentes.map((curso, index) => (
                                            <li key={index} className={curso.vencido ? "text-danger" : "text-success"}>
                                                <strong>{curso.tipoCurso}</strong> — {curso.categoria}
                                                <br />
                                                <small>Fecha de Realización: <strong>{curso.fechaCurso}</strong></small>
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
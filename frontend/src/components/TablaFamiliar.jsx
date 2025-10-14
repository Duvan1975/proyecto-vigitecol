import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import Paginacion from "./Paginacion";
import ExportModalFamiliar from "./ExportModalFamiliar";

export function TablaFamiliar({ tipoEmpleado, titulo, genero, tipoBusqueda, edadMax }) {
    const [empleadosConFamiliares, setEmpleadosConFamiliares] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalElementos, setTotalElementos] = useState(0);
    const [tamanoPagina, setTamanoPagina] = useState(0);
    const [totalFamiliares, setTotalFamiliares] = useState(0);
    const [cargando, setCargando] = useState(true);
    const [isExportOpen, setIsExportOpen] = useState(false);


    useEffect(() => {
        cargarEmpleadosConFamiliares(paginaActual);
        // eslint-disable-next-line
    }, [paginaActual, tipoEmpleado, genero, tipoBusqueda, edadMax]);

    // Función para cargar todas las páginas
    const cargarTodasLasPaginas = async () => {
        try {
            let todosLosDatos = [];

            // Recorremos todas las páginas
            for (let pagina = 0; pagina < totalPaginas; pagina++) {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
                let url;
                if (tipoBusqueda === "conFamiliares") {
                    url = `${backendUrl}/empleados/con-familiares-menores?edadMax=${edadMax}&page=${pagina}`;
                    if (tipoEmpleado) url += `&tipoEmpleado=${tipoEmpleado}`;
                } else if (tipoBusqueda === "familiaresPorGenero") {
                    url = `${backendUrl}/empleados/conFamiliares/genero?page=${pagina}`;
                    if (genero) url += `&genero=${genero}`;
                    if (tipoEmpleado) url += `&tipoEmpleado=${tipoEmpleado}`;
                } else {
                    continue;
                }

                const response = await authFetch(url);
                const data = await response.json();
                todosLosDatos = [...todosLosDatos, ...data.content];
            }

            return todosLosDatos;
        } catch (error) {
            console.error("Error al cargar todas las páginas:", error);
            throw error;
        }
    };

    const cargarEmpleadosConFamiliares = (pagina = 0) => {
        setCargando(true);
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
        let url;
        if (tipoBusqueda === "conFamiliares") {
            url = `${backendUrl}/empleados/con-familiares-menores?page=${pagina}`;
            if (edadMax) url += `&edadMax=${edadMax}`;
            if (tipoEmpleado) url += `&tipoEmpleado=${tipoEmpleado}`;
        } else if (tipoBusqueda === "familiaresPorGenero") {
            url = `${backendUrl}/empleados/conFamiliares/genero?page=${pagina}`;
            if (genero) url += `&genero=${genero}`;
            if (tipoEmpleado) url += `&tipoEmpleado=${tipoEmpleado}`;
        } else {
            setCargando(false);
            return;
        }

        authFetch(url)
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
                console.error("Error al cargar empleados con familiares:", error);
                setCargando(false);
            });
    };

    if (cargando) {
        return <p>Cargando listado...</p>;
    }

    if (empleadosConFamiliares.length === 0) {
        return <p className="text-center text-muted">No hay personal con hijos o hijastros registrados.</p>;
    }

    //Función para exportar título al Modal
    const tituloExportacion =
        tipoBusqueda === "conFamiliares"
            ? `${titulo}`
            : `${titulo} ${totalElementos}`;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-1">
                <h4 className="alinearTexto">
                    {tipoBusqueda === "conFamiliares"
                        ? `${titulo} (hijos/hijastros ${totalFamiliares} en esta página)`
                        : `${titulo} ${totalElementos} (hijos/hijastros ${totalFamiliares} en esta página)`}
                </h4>
            </div>

            <ExportModalFamiliar
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                datos={empleadosConFamiliares}
                tituloExportacion={tituloExportacion}
                totalPaginas={totalPaginas}
                cargarTodasLasPaginas={cargarTodasLasPaginas}
                totalElementos={totalElementos}
            />
            <div className="row align-items-center mb-1">
                <div className="col text-start"></div> {/* espacio vacío para balancear */}
                <div className="col text-center">
                    <Paginacion
                        paginaActual={paginaActual}
                        totalPaginas={totalPaginas}
                        onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
                    />
                </div>
                <div className="col text-end d-flex align-items-center justify-content-end">
                    <button className="btn btn-success"
                        onClick={() => setIsExportOpen(true)}
                    >
                        Exportar a Excel
                    </button>
                </div>

            </div>
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
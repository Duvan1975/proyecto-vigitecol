import React, { useState, useEffect } from "react";
import Paginacion from "./Paginacion";
import { authFetch } from "../utils/authFetch";
import * as XLSX from "xlsx";

export function HistorialAcciones() {
  const [historial, setHistorial] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cargando, setCargando] = useState(false);

  // 🔹 Filtro
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [modoFiltro, setModoFiltro] = useState(false);

  // 🔹 Paginación
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [tamanoPagina, setTamanoPagina] = useState(10);

  const cargarHistorial = async (pagina = 0) => {
    setCargando(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

      let url = `${backendUrl}/historial?page=${pagina}&size=${tamanoPagina}`;

      // 👉 Si se está usando filtro
      if (modoFiltro && fechaDesde && fechaHasta) {
        url = `${backendUrl}/historial/filtrar?desde=${fechaDesde}T00:00:00&hasta=${fechaHasta}T23:59:59&page=${pagina}&size=${tamanoPagina}`;
      }

      const response = await authFetch(url);
      if (!response.ok) throw new Error("Error al obtener historial");

      const data = await response.json();
      setHistorial(data.content || []);
      setTotalPaginas(data.totalPages);
      setPaginaActual(data.number);
      setTotalElementos(data.totalElements);
      setTamanoPagina(data.size);
    } catch (error) {
      console.error("Error cargando historial:", error);
    } finally {
      setCargando(false);
    }
  };

  // Cargar al mostrar el componente
  useEffect(() => {
    if (visible) cargarHistorial(paginaActual);
    // eslint-disable-next-line
  }, [paginaActual, visible]);

  const aplicarFiltro = () => {
    if (!fechaDesde || !fechaHasta) return;
    setModoFiltro(true);
    setPaginaActual(0);
    cargarHistorial(0);
  };

  const limpiarFiltro = () => {
    setFechaDesde("");
    setFechaHasta("");
    setModoFiltro(false);
    setPaginaActual(0);
    cargarHistorial(0);
  };

  // 🔹 Exportar Excel (todo o filtrado)
  const exportarExcel = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

      let url = `${backendUrl}/historial/todo`;

      if (modoFiltro && fechaDesde && fechaHasta) {
        url = `${backendUrl}/historial/filtrar/todo?desde=${fechaDesde}T00:00:00&hasta=${fechaHasta}T23:59:59`;
      }

      const response = await authFetch(url);
      const data = await response.json();

      const ws = XLSX.utils.json_to_sheet(
        data.map((h) => ({
          ID: h.id,
          Usuario: h.usuario,
          Acción: h.accion,
          Descripción: h.descripcion,
          Fecha: new Date(h.fecha).toLocaleString(),
        }))
      );

      const range = XLSX.utils.decode_range(ws["!ref"]);
      ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) };

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Historial");

      XLSX.writeFile(
        wb,
        modoFiltro ? "HistorialFiltrado.xlsx" : "HistorialCompleto.xlsx"
      );
    } catch (error) {
      console.error("Error exportando historial:", error);
    }
  };

  return (
    <div className="container mt-4">
      <button className="btn btn-primary" onClick={() => setVisible(!visible)}>
        {visible ? "Ocultar historial" : "Historial de Acciones"}
      </button>

      {visible && (
        <>
          {/* 🔹 Filtro */}
          <div className="row d-flex align-items-end gap-2">

            <div className="col-md-3">
              <label><strong>Fecha Desde:</strong></label>
              <input
                type="date"
                className="form-control"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>

            <div className="col-md-3">
              <label><strong>Fecha Hasta:</strong></label>
              <input
                type="date"
                className="form-control"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>

            {/* Botones juntos en línea */}
            <div className="col-md-4 d-flex align-items-end gap-2">

              <button className="btn btn-secondary" onClick={aplicarFiltro}>
                Filtrar
              </button>

              {/* Limpiar siempre visible */}
              <button className="btn btn-warning" onClick={limpiarFiltro}>
                Limpiar
              </button>

              <button className="btn btn-success" onClick={exportarExcel}>
                Exportar a Excel
              </button>

            </div>

          </div>

          {/* TABLA */}
          {!cargando && historial.length > 0 && (
            <div className="table-responsive mt-4">
              <table className="table table-striped table-bordered text-center align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h) => (
                    <tr key={h.id}>
                      <td>{h.id}</td>
                      <td>{h.usuario}</td>
                      <td>{h.accion}</td>
                      <td>{h.descripcion}</td>
                      <td>{new Date(h.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Paginación */}
              <Paginacion
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
              />

              <div className="mt-2 text-center">
                <small>
                  Página {paginaActual + 1} de {totalPaginas} — {tamanoPagina} por
                  página (Total: {totalElementos})
                </small>
              </div>
            </div>
          )}

          {!cargando && historial.length === 0 && (
            <p className="text-center mt-3">No hay registros.</p>
          )}
        </>
      )}
    </div>
  );
}

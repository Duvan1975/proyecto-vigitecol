import React, { useState, useEffect } from "react";
import Paginacion from "./Paginacion";
import { authFetch } from "../utils/authFetch";

export function HistorialAcciones() {
  const [historial, setHistorial] = useState([]);
  const [visible, setVisible] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Estados de paginación
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [tamanoPagina, setTamanoPagina] = useState(10);

  // 🔹 Cargar historial con paginación desde el backend
  const cargarHistorial = async (pagina = 0) => {
    setCargando(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
      const response = await authFetch(`${backendUrl}/historial?page=${pagina}&size=${tamanoPagina}`);

      if (!response.ok) throw new Error("Error al obtener el historial");

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

  // 🔹 Cargar historial cuando cambie la página o se muestre el componente
  useEffect(() => {
    if (visible) {
      cargarHistorial(paginaActual);
    }
    // eslint-disable-next-line
  }, [paginaActual, visible]);

  return (
    <div className="container mt-4">
      <h3 className="text-center">📜 Historial de Acciones</h3>

      {/* Botón para mostrar/ocultar historial */}
      <div className="text-center mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setVisible(!visible)}
        >
          {visible ? "Ocultar historial" : "Mostrar historial"}
        </button>
      </div>

      {visible && (
        <>
          {cargando && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando historial...</p>
            </div>
          )}

          {!cargando && historial.length > 0 && (
            <div className="table-responsive">
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
            </div>
          )}

          {!cargando && historial.length === 0 && (
            <p className="text-center mt-3">No hay registros en el historial.</p>
          )}

          {/* 🔹 Paginación */}
          <div className="d-flex flex-column align-items-center mt-3">
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onChange={(nuevaPagina) => setPaginaActual(nuevaPagina)}
            />

            <div className="mt-2 text-center">
              <small>
                Mostrando página {paginaActual + 1} de {totalPaginas} —{" "}
                {tamanoPagina} por página, total de registros: {totalElementos}
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

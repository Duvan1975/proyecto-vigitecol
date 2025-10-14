import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Captura el token de la URL
  const [nuevaClave, setNuevaClave] = useState("");
  const [confirmarClave, setConfirmarClave] = useState(""); 

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Token inválido o expirado",
      });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nuevaClave !== confirmarClave) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/password-reset/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, nuevaClave }),
      });

      if (!response.ok) {
        throw new Error("No se pudo restablecer la contraseña");
      }

      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "Tu contraseña ha sido restablecida correctamente",
      }).then(() => {
        window.location.href = "/";
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Error al restablecer la contraseña",
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h3 className="text-center text-primary mb-3">Restablecer Contraseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nueva Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={nuevaClave}
              onChange={(e) => setNuevaClave(e.target.value)}
              required
              style={{ borderRadius: "20px" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirmar Contraseña:</label>
            <input
              type="password"
              className="form-control"
              value={confirmarClave}
              onChange={(e) => setConfirmarClave(e.target.value)}
              required
              style={{ borderRadius: "20px" }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2"
            style={{ borderRadius: "20px", fontSize: "18px" }}
          >
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
}
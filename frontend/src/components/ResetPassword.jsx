import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function ResetPassword() {
  const [token, setToken] = useState(null);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  // Cuando la página carga, extraemos el token de la URL y lo validamos
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    setToken(t);

    if (!t) {
      Swal.fire("Error", "Token no encontrado en la URL", "error");
      return;
    }

    fetch(`http://localhost:8081/password-reset/validate?token=${t}`)
      .then(res => {
        if (res.ok) {
          setValid(true);
        } else {
          Swal.fire("Error", "Token inválido o expirado", "error");
        }
      })
      .catch(() => Swal.fire("Error", "No se pudo conectar al servidor", "error"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    if (password !== confirmPwd) {
      Swal.fire("Error", "Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8081/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, nuevaClave: password })
      });
      const data = await response.json();

      if (response.ok) {
        Swal.fire("Éxito", data.message || "Contraseña actualizada correctamente", "success")
          .then(() => window.location.href = "/login");
      } else {
        Swal.fire("Error", data.error || "No se pudo actualizar la contraseña", "error");
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar al servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!valid) return null;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg" style={{ width: "400px" }}>
        <div className="card-body p-4">
          <h4 className="text-center text-primary mb-3">Restablecer Contraseña</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nueva contraseña:</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirmar contraseña:</label>
              <input
                type="password"
                className="form-control"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Cambiar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

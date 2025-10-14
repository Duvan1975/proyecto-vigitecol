import Swal from "sweetalert2";
import { useState } from "react";
import logoVigitecol from '../img/vigitecol.png';

export function Login({ onLoginSuccess }) {
    const [admin, setAdmin] = useState(""); 
    const [clave, setClave] = useState("");

    const handleLogin = async () => {
        try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8081";
        const response = await fetch(`${backendUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ admin, clave })
            });

            if (!response.ok) {
                // Intentamos leer el JSON que envía el backend
                let errorMsg = "Error al ingresar usuario o contraseña";
                try {
                    const errorData = await response.json();
                    if (errorData.error) {
                        errorMsg = errorData.error;
                    }
                } catch {
                    // Si no viene JSON válido, dejamos el mensaje genérico
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("rol", data.rol);
            localStorage.setItem("admin", data.admin);
            localStorage.setItem("estado", data.estado);

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                html: `
                <p>Bienvenido: <strong>${data.admin}</strong></p>
                <p>Rol: <strong>${data.rol}</strong></p>
            `
            }).then(() => {
                if (onLoginSuccess) {
                    onLoginSuccess();
                }
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: error.message || "Error al ingresar usuario o contraseña"
            });
        }
    };

    const handleForgotPassword = async () => {
  const { value: email } = await Swal.fire({
    title: 'Recuperar contraseña',
    input: 'email',
    inputLabel: 'Ingresa tu correo registrado',
    inputPlaceholder: 'correo@ejemplo.com',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar'
  });

  if (email) {
    try {
      // CAMBIA ESTA LÍNEA - Usa la variable de entorno
      const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
      const response = await fetch(`${backendUrl}/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin: email })
      });
      const data = await response.json();
      if (response.ok) {
        Swal.fire('¡Listo!', data.message || 'Si el usuario existe, se enviaron instrucciones a tu correo.', 'success');
      } else {
        Swal.fire('Error', data.error || 'No se pudo enviar el correo.', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'No se pudo conectar con el servidor.', 'error');
    }
  }
};

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg" style={{ width: "400px" }}>
                <div className="card-body p-4 text-center">

                    {/* Imagen de la empresa */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-center">
                            <img
                                src={logoVigitecol}
                                alt="Logo Vigitecol"
                                className="img-fluid"  // Hace que sea responsive
                                style={{ maxWidth: '220px', height: 'auto' }}  // Tamaño máximo controlado

                            />
                        </div>
                        <h4 className="card-title text-primary mt-2">Inicio de Sesión</h4>
                        <p className="text-muted">Sistema de Gestión de Personal</p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label text-start w-100">Usuario:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={admin}
                            onChange={(e) => setAdmin(e.target.value)}
                            placeholder="Ingresa tu usuario"
                            style={{ borderRadius: "20px" }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-start w-100">Contraseña:</label>
                        <input
                            type="password"
                            className="form-control"
                            value={clave}
                            onChange={(e) => setClave(e.target.value)}
                            placeholder="Ingresa tu contraseña"
                            style={{ borderRadius: "20px" }}
                        />
                    </div>

                    <button
                        className="btn btn-primary w-100 py-2"
                        onClick={handleLogin}
                        style={{ borderRadius: "20px", fontSize: "18px" }}
                    >
                        Iniciar sesión
                    </button>

                    {/* 👇 Nuevo link para recuperar contraseña */}
                    <div className="mt-3">
                        <button
                            type="button"
                            className="btn btn-link text-decoration-none"
                            onClick={handleForgotPassword}
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
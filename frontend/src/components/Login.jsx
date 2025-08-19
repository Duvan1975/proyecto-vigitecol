import Swal from "sweetalert2";
import { useState } from "react";

export function Login() {
    
    //Creando estados de usuario y contraseña
    const [admin, setAdmin] = useState("");
    const [clave, setClave] = useState("");

    const handleLogin = async () => {
        try {

            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ admin, clave })
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || "Credenciales Incorrectas");
            }
            const data = await response.json();
            localStorage.setItem("token", data.jwTtoken); //Guarda el token

            Swal.fire({
                icon: "success",
                title: "Inicio de sesión exitoso",
                text: "Token guardado correctamente"
            });

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error al iniciar sesión",
                text: error.message
            });
        }
    };
    return (
    <div className="container">
      <h2 className="mt-4 mb-3">Iniciar Sesión</h2>
      <div className="mb-3">
        <label>Usuario (admin):</label>
        <input
          type="text"
          className="form-control"
          value={admin}
          onChange={(e) => setAdmin(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Contraseña:</label>
        <input
          type="password"
          className="form-control"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
      </div>
      <button className="btn btn-primary" onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  );
}
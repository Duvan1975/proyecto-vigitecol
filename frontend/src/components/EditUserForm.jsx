import React, { useState } from 'react';
import { authPut, authPatch } from '../utils/authFetch';
import Swal from "sweetalert2";

export const EditUserForm = ({ user, onUserUpdated, onCancel }) => {
    const [formData, setFormData] = useState({
        nombreUsuario: user.nombreUsuario,
        admin: user.admin,
        rol: user.rol,
        estado: user.estado,
        clave: '',
        confirmarClave: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.clave && formData.clave !== formData.confirmarClave) {
            await Swal.fire({
                icon: "warning",
                title: "Contraseñas no coinciden",
                text: "Por favor verifica que ambas contraseñas sean iguales.",
                confirmButtonColor: "#ffc107"
            });
            return;
        }

        try {
            // Preparar datos para enviar (sin confirmarClave)
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const userData = {
                nombreUsuario: formData.nombreUsuario,
                admin: formData.admin,
                rol: formData.rol,
                estado: formData.estado
            };

            // Solo agregar clave si se proporcionó una nueva
            if (formData.clave) {
                userData.clave = formData.clave;
            }

            await authPut(`${backendUrl}/usuarios/${user.id}`, userData);

            await Swal.fire({
                icon: "success",
                title: "Usuario actualizado",
                text: "Los cambios se han guardado correctamente.",
                confirmButtonColor: "#198754"
            });

            onUserUpdated();
        } catch (error) {
            const mensaje = (error && error.message) ? error.message : "Ocurrió un error al guardar los cambios.";

            // Mostrar mensajes específicos: correo duplicado o reglas de contraseña
            const lower = mensaje.toLowerCase();
            const isCorreo = lower.includes("correo") || lower.includes("email") || lower.includes("usuario") || lower.includes("ya existe");
            const isPasswordRule = lower.includes("contrase") || lower.includes("mínimo") || lower.includes("mayúscula") || lower.includes("minúscula") || lower.includes("carácter especial") || lower.includes("número");

            let textoAMostrar = "Verifica que el correo no esté duplicado o revisa los datos ingresados.";
            if (isCorreo) textoAMostrar = mensaje;
            else if (isPasswordRule) textoAMostrar = mensaje;

            await Swal.fire({
                icon: "error",
                title: "❌ Error al actualizar",
                text: textoAMostrar,
                confirmButtonColor: "#dc3545"
            });
        }
    };

    const handleChangeEstado = async (nuevoEstado) => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            await authPatch(`${backendUrl}/usuarios/${user.id}/estado?estado=${nuevoEstado}`);

            await Swal.fire({
                icon: "success",
                title: `Usuario ${nuevoEstado ? "activado" : "desactivado"}`,
                text: `El usuario ha sido ${nuevoEstado ? "activado" : "desactivado"} correctamente.`,
                confirmButtonColor: nuevoEstado ? "#198754" : "#dc3545"
            });

            onUserUpdated();
        } catch (error) {
            await Swal.fire({
                icon: "error",
                title: "Error al cambiar estado",
                text: error.message || "No se pudo actualizar el estado del usuario.",
                confirmButtonColor: "#dc3545"
            });
        }
    };
        const handleCancel = () => {
        Swal.fire({
            icon: 'info',
            title: 'Acción cancelada',
            text: 'La edición fue cancelada por el usuario.',
            confirmButtonText: 'Entendido'
        });
        onCancel();
    };

    return (
        <div className="card mt-3">
            <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">✏️ Editar Usuario: {user.nombreUsuario}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Nombre completo *</label>
                            <input
                                type="text"
                                className="form-control"
                                value={formData.nombreUsuario}
                                onChange={(e) => setFormData({ ...formData, nombreUsuario: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Email/Usuario *</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.admin}
                                onChange={(e) => setFormData({ ...formData, admin: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Rol *</label>
                            <select
                                className="form-select"
                                value={formData.rol}
                                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                required
                            >
                                <option value="USER">Usuario</option>
                                <option value="RRHH">Recursos Humanos</option>
                                <option value="ADMIN">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Nueva Contraseña (opcional)</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.clave}
                                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                                placeholder="Dejar vacío para no cambiar"
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.confirmarClave}
                                onChange={(e) => setFormData({ ...formData, confirmarClave: e.target.value })}
                                placeholder="Solo si cambias la contraseña"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.estado}
                                onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
                            />
                            <label className="form-check-label">Usuario activo</label>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            💾 Guardar Cambios
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            ❌ Cancelar
                        </button>
                        <button
                            type="button"
                            className={`btn ${user.estado ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleChangeEstado(!user.estado)}
                        >
                            {user.estado ? '🚫 Desactivar' : '✅ Activar'} Usuario
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserForm;
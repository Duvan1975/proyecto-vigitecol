import React, { useState } from 'react';
import { authPost } from '../utils/authFetch';
import Swal from 'sweetalert2';

const UserForm = ({ onUserCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        nombreUsuario: '',
        admin: '',
        clave: '',
        confirmarClave: '',
        rol: 'USER',
        estado: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.clave !== formData.confirmarClave) {
            Swal.fire({
                icon: 'warning',
                title: 'Contraseñas no coinciden',
                text: 'Por favor verifica los campos de contraseña.',
                confirmButtonText: 'Aceptar'
            });
            return;
        }

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";

            const response = await authPost(`${backendUrl}/usuarios`, {
                nombreUsuario: formData.nombreUsuario,
                admin: formData.admin,
                clave: formData.clave,
                rol: formData.rol,
                estado: formData.estado
            });

            // Verificar si el backend devuelve un error conocido
            if (response && response.error && response.error.includes("ya existe")) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Usuario duplicado',
                    text: 'El email o usuario ingresado ya está registrado.',
                    confirmButtonText: 'Entendido'
                });
                return;
            }

            Swal.fire({
                icon: 'success',
                title: 'Usuario creado',
                text: 'El usuario fue creado exitosamente.',
                confirmButtonText: 'Aceptar'
            });

            onUserCreated(); // Recargar la lista

            setFormData({
                nombreUsuario: '',
                admin: '',
                clave: '',
                confirmarClave: '',
                rol: 'USER',
                estado: true
            });

} catch (error) {
    if (error.status === 400 && error.message.includes("ya existe")) {
        Swal.fire({
            icon: 'warning',
            title: 'Usuario duplicado',
            text: 'Ya existe un usuario con ese correo.',
            confirmButtonText: 'Entendido'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error creando usuario',
            text: error.message || 'Ocurrió un error inesperado.',
            confirmButtonText: 'Cerrar'
        });
    }
}

    };

    const handleCancel = () => {
        Swal.fire({
            icon: 'info',
            title: 'Acción cancelada',
            text: 'La creación de usuario fue cancelada por el administrador.',
            confirmButtonText: 'Entendido'
        });
        onCancel();
    };

    return (
        <div className="card mt-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">➕ Crear Nuevo Usuario</h5>
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
                        <div className="col-md-4">
                            <label className="form-label">Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.clave}
                                onChange={(e) => setFormData({ ...formData, clave: e.target.value })}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.confirmarClave}
                                onChange={(e) => setFormData({ ...formData, confirmarClave: e.target.value })}
                                required
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
                        <button type="submit" className="btn btn-success">
                            ✅ Crear Usuario
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                            ❌ Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;

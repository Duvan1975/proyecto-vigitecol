import React, { useState } from 'react';
import { authPut, authPatch } from '../utils/authFetch';

export const EditUserForm = ({ user, onUserUpdated, onCancel }) => {
    const [formData, setFormData] = useState({
        admin: user.admin,
        rol: user.rol,
        estado: user.estado,
        clave: '',
        confirmarClave: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.clave && formData.clave !== formData.confirmarClave) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            // Preparar datos para enviar (sin confirmarClave)
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const userData = {
                admin: formData.admin,
                rol: formData.rol,
                estado: formData.estado
            };

            // Solo agregar clave si se proporcionó una nueva
            if (formData.clave) {
                userData.clave = formData.clave;
            }

            await authPut(`${backendUrl}/usuarios/${user.id}`, userData);
            
            alert('Usuario actualizado exitosamente');
            onUserUpdated();
        } catch (error) {
            alert('Error actualizando usuario: ' + error.message);
        }
    };

    const handleChangeEstado = async (nuevoEstado) => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            await authPatch(`${backendUrl}/usuarios/${user.id}/estado?estado=${nuevoEstado}`);
            alert(`Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`);
            onUserUpdated();
        } catch (error) {
            alert('Error cambiando estado: ' + error.message);
        }
    };

    return (
        <div className="card mt-3">
            <div className="card-header bg-warning text-dark">
                <h5 className="mb-0">✏️ Editar Usuario: {user.admin}</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Email/Usuario *</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.admin}
                                onChange={(e) => setFormData({...formData, admin: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">Rol *</label>
                            <select
                                className="form-select"
                                value={formData.rol}
                                onChange={(e) => setFormData({...formData, rol: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, clave: e.target.value})}
                                placeholder="Dejar vacío para no cambiar"
                            />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">Confirmar Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.confirmarClave}
                                onChange={(e) => setFormData({...formData, confirmarClave: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                            />
                            <label className="form-check-label">Usuario activo</label>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">
                            💾 Guardar Cambios
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
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
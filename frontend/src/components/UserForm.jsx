// src/components/UserForm.jsx
import React, { useState } from 'react';
import { authPost } from '../utils/authFetch';

const UserForm = ({ onUserCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        admin: '',
        clave: '',
        confirmarClave: '',
        rol: 'USER',
        estado: true
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.clave !== formData.confirmarClave) {
            alert('Las contraseñas no coinciden');
            return;
        }

        try {
            await authPost('http://localhost:8080/usuarios', {
                admin: formData.admin,
                clave: formData.clave,
                rol: formData.rol,
                estado: formData.estado
            });
            
            alert('Usuario creado exitosamente');
            onUserCreated(); // Recargar la lista
            setFormData({
                admin: '',
                clave: '',
                confirmarClave: '',
                rol: 'USER',
                estado: true
            });
        } catch (error) {
            alert('Error creando usuario: ' + error.message);
        }
    };

    return (
        <div className="card mt-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">➕ Crear Nuevo Usuario</h5>
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
                            <label className="form-label">Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.clave}
                                onChange={(e) => setFormData({...formData, clave: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="col-md-6">
                            <label className="form-label">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                className="form-control"
                                value={formData.confirmarClave}
                                onChange={(e) => setFormData({...formData, confirmarClave: e.target.value})}
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
                                onChange={(e) => setFormData({...formData, estado: e.target.checked})}
                            />
                            <label className="form-check-label">Usuario activo</label>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                            ✅ Crear Usuario
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            ❌ Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;
// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { authGet } from '../utils/authFetch';
import UserForm from './UserForm';
import EditUserForm from './EditUserForm';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await authGet('http://localhost:8080/usuarios');
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading users:', error);
            setUsers([]);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>👥 Gestión de Usuarios</h2>
                {!showForm && !editingUser && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        ➕ Nuevo Usuario
                    </button>
                )}
            </div>

            {showForm && (
                <UserForm
                    onUserCreated={() => {
                        setShowForm(false);
                        loadUsers(); // Recargar lista después de crear
                    }}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {editingUser && (
                <EditUserForm
                    user={editingUser}
                    onUserUpdated={() => {
                        setEditingUser(null);
                        loadUsers();
                    }}
                    onCancel={() => setEditingUser(null)}
                />
            )}

            {users.length === 0 ? (
                <div className="alert alert-info">
                    No hay usuarios registrados
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.admin}</td>
                                    <td>
                                        <span className={`badge ${user.rol === 'ADMIN' ? 'bg-danger' :
                                                user.rol === 'RRHH' ? 'bg-warning' : 'bg-info'
                                            }`}>
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.estado ? 'bg-success' : 'bg-secondary'
                                            }`}>
                                            {user.estado ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setEditingUser(user)}
                                            title="Editar usuario"
                                        >
                                            ✏️ Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
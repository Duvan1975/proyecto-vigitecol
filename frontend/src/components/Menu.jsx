import { useState, useEffect } from "react";
import { Formulario } from "./Formulario";
import { Tabla } from "./Tabla";
import { Login } from "./Login";
import Swal from "sweetalert2";
import logoVigitecol from '../img/vigitecol.png'; // Ajusta la ruta según tu estructura
import ProtectedElement from "../utils/ProtectedElement";
import UserManagement from "./UserManagement";
import ResetPassword from "./ResetPassword";

export function Menu() {
    const [vista, setVista] = useState("login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const params = new URLSearchParams(window.location.search);
        if (window.location.pathname.includes("reset-password") && params.get("token")) {
            setVista("reset-password");
            setCargando(false);
            return;
        }

        if (token) {
            // Verificar si el token es válido
            verificarToken(token);
        } else {
            setCargando(false);
            setVista("login");
        }
    }, []);

    const verificarToken = async (token) => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
            const response = await fetch(`${backendUrl}/auth/verificar`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setIsLoggedIn(true);
                setVista("menu");
            } else {
                // Token inválido, limpiar y mostrar login
                localStorage.removeItem("token");
                localStorage.removeItem("rol");
                localStorage.removeItem("admin");
                localStorage.removeItem("estado");
                setVista("login");
            }
        } catch (error) {
            console.error("Error verificando token:", error);
            setVista("login");
        } finally {
            setCargando(false);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        setVista("menu");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        localStorage.removeItem("admin");
        localStorage.removeItem("nombreUsuario");
        localStorage.removeItem("estado");
        setIsLoggedIn(false);
        setVista("login");
    };

    const BackupButton = () => {
        const handleBackup = async () => {
            const token = localStorage.getItem("token"); // si usas autenticación
            const response = await fetch("http://localhost:8081/backup/download", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                alert("Error al generar el backup");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "backup_vigitecol.sql";
            a.click();
            window.URL.revokeObjectURL(url);
        };

        return (
            <button className="btn btn-outline-success" onClick={handleBackup}>
                💾 Descargar Backup
            </button>
        );
    };


    // Mostrar loading mientras verifica el token
    if (cargando) {
        return (
            <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid px-0"> {/* Contenedor fluido */}

            {/* Header fijo en la parte superior */}
            {isLoggedIn && (
                <header className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top navbar-custom">
                    <div className="container">
                        {/* Logo a la izquierda */}
                        <div className="d-flex align-items-center">
                            <img
                                src={logoVigitecol}
                                alt="Logo Vigitecol"
                                style={{
                                    width: "150px",
                                    height: "50px",
                                    marginRight: "15px"
                                }}
                            />
                            <span className="navbar-brand mb-0 h1 text-white">
                                Personal Administrativo y Operativo Vigitecol
                            </span>
                        </div>

                        {/* Información del usuario a la derecha */}
                        <div className="d-flex align-items-center">
                            <div className="text-white me-3 text-end">
                                <div className="fw-bold text-warning">{localStorage.getItem("nombreUsuario")}</div>
                                <small className="opacity-75">Rol: {localStorage.getItem("rol")}</small>
                            </div>
                            <button
                                className="btn btn-outline-warning btn-sm"
                                title="Cerrar sesión"
                                onClick={() => {
                                    Swal.fire({
                                        title: "¿Deseas cerrar sesión?",
                                        text: "Se cerrará tu sesión actual y deberás volver a iniciar sesión.",
                                        icon: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#3085d6",
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Sí, cerrar sesión",
                                        cancelButtonText: "Cancelar",
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            handleLogout(); // 👉 solo ejecuta el cierre si el usuario confirma
                                            Swal.fire({
                                                icon: "success",
                                                title: "Sesión cerrada",
                                                text: "Has cerrado sesión correctamente.",
                                                timer: 1500,
                                                showConfirmButton: false,
                                            });
                                        }
                                    });
                                }}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* Contenido principal (crece para empujar el footer abajo) */}
            <main className="flex-grow-1">
                <div className="container mt-3">
                    {/* ... (código existente de botones y vistas) ... */}
                    {isLoggedIn && vista !== "login" && (
                        <div className="mb-4">
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                                <button
                                    className={`btn btn-outline-primary position-relative ${vista === "menu" ? "active-tab" : ""}`}
                                    onClick={() => setVista("menu")}
                                >
                                    <i className="bi bi-house me-1"></i><strong>Inicio</strong>
                                    {vista === "menu" && <div className="active-tab-indicator"></div>}
                                </button>

                                <ProtectedElement allowedRoles={["RRHH"]}>
                                    <button
                                        className={`btn btn-outline-primary position-relative ${vista === "formulario" ? "active-tab" : ""}`}
                                        onClick={() => setVista("formulario")}
                                    >
                                        {vista === "formulario" && <div className="active-tab-indicator"></div>}
                                        <strong>Registrar Empleado</strong>
                                    </button>
                                </ProtectedElement>

                                <ProtectedElement allowedRoles={["ADMIN"]}>
                                    <button
                                        className="btn btn-outline-dark"
                                        onClick={() => setVista("gestionUsuarios")}
                                    >
                                        👥 Gestión de Usuarios
                                    </button>
                                </ProtectedElement>

                                <button
                                    className={`btn btn-outline-primary position-relative ${vista === "tabla" ? "active-tab" : ""}`}
                                    onClick={() => setVista("tabla")}
                                >
                                    {vista === "tabla" && <div className="active-tab-indicator"></div>}
                                    <strong>Empleados Activos</strong>
                                </button>
                                <button
                                    className={`btn btn-outline-primary position-relative ${vista === "administrativos" ? "active-tab" : ""}`}
                                    onClick={() => setVista("administrativos")}
                                >
                                    {vista === "administrativos" && <div className="active-tab-indicator"></div>}
                                    <strong>Administrativos</strong>
                                </button>
                                <button
                                    className={`btn btn-outline-primary position-relative ${vista === "operativos" ? "active-tab" : ""}`}
                                    onClick={() => setVista("operativos")}
                                >
                                    {vista === "operativos" && <div className="active-tab-indicator"></div>}
                                    <strong>Operativos</strong>
                                </button>
                                <button
                                    className={`btn btn-outline-primary position-relative ${vista === "supervisores" ? "active-tab" : ""}`}
                                    onClick={() => setVista("supervisores")}
                                >
                                    {vista === "supervisores" && <div className="active-tab-indicator"></div>}
                                    <strong>Supervisores</strong>
                                </button>
                                <button
                                    className={`btn btn-outline-warning position-relative ${vista === "inactivas" ? "active-tab-warning" : ""}`}
                                    onClick={() => setVista("inactivas")}
                                >
                                    {vista === "inactivas" && <div className="active-tab-indicator-warning"></div>}
                                    <strong>Empleados Retirados</strong>
                                </button>
                            </div>
                        </div>
                    )}

                    {!isLoggedIn && vista !== "login" && (
                        <div className="text-center mb-4">
                            <button className="btn btn-primary btn-lg" onClick={() => setVista("login")}>
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Iniciar Sesión
                            </button>
                        </div>
                    )}

                    {vista === "formulario" && <Formulario setVista={setVista} />}
                    {vista === "tabla" && <Tabla mostrarInactivos={false} />}
                    {vista === "inactivas" && <Tabla mostrarInactivos={true} />}
                    {vista === "administrativos" && <Tabla mostrarAdministrativos={true} />}
                    {vista === "operativos" && <Tabla mostrarOperativos={true} />}
                    {vista === "supervisores" && <Tabla mostrarSupervisores={true} />}
                    {vista === "gestionUsuarios" && <UserManagement />}

                    {vista === "login" && (
                        <Login onLoginSuccess={handleLoginSuccess} />
                    )}
                    {vista === "reset-password" && (
                        <ResetPassword />
                    )}

                    {isLoggedIn && vista === "menu" && (
                        <div className="text-center mt-5">
                            <div className="card border-0 shadow">
                                <div className="card-body py-5">
                                    <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "3rem" }}></i>
                                    <h3 className="card-title text-primary mt-3">¡Bienvenido!</h3>
                                    <p className="card-text lead">
                                        Sistema de gestión para personal administrativo y operativo de VIGITECOL
                                    </p>
                                    <p className="text-muted">
                                        Selecciona una opción del menú superior para comenzar
                                    </p>
                                </div>
                                <ProtectedElement allowedRoles={["ADMIN"]}>
                                    <BackupButton />
                                </ProtectedElement>

                            </div>
                        </div>
                    )}
                </div>
            </main>
            <br />
            {/* Footer */}
            {isLoggedIn && (
                <footer className="bg-dark text-white py-4 mt-auto">
                    <div className="container">
                        <div className="row">
                            {/* Información de la empresa */}
                            <div className="col-md-8 mb-3 mb-md-0">
                                <h5 className="fw-bold text-warning">Vigitecol Ltda</h5>
                                <p className="mb-1">
                                    <i className="bi bi-shield-check me-2"></i>
                                    Seguridad Privada | Vigilancia
                                </p>

                                <p className="mb-2">
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    🛡️ Somos una empresa de seguridad y vigilancia que está en continua evolución!
                                </p>
                                <p className="mb-2">
                                    <i className="bi bi-lock-fill me-2"></i>
                                    🔐 Cuidamos lo tuyo como si fuera nuestro
                                </p>
                            </div>

                            {/* Direcciones */}
                            <div className="col-md-4">
                                <h6 className="fw-bold text-warning">Ubicación:</h6>
                                <div className="mb-2">
                                    <i className="bi bi-geo-alt-fill me-2"></i>
                                    Av. Santander #43-12, Manizales
                                </div>

                                {/* Información de contacto adicional */}
                                <div className="mt-2">
                                    <i className="bi bi-telephone me-2"></i>
                                    Teléfono: (606) 885-1234
                                    <br />
                                    <i className="bi bi-envelope me-2"></i>
                                    Email: info@vigitecol.com
                                </div>
                            </div>
                        </div>

                        {/* Línea divisoria y copyright */}
                        <hr className="my-3 bg-secondary" />
                        <div className="text-center">
                            © {new Date().getFullYear()} Vigitecol Ltda. Todos los derechos reservados.
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
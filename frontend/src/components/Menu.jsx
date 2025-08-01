import { useState } from "react";
import { Formulario } from "./Formulario";
import { Tabla } from "./Tabla";

export function Menu() {
    //Aquí mostramos el componente principal
    const [vista, setVista] = useState("menu");

    return (
        <div className="container">
            <h1 className="alinearTexto">Personal Administrativo y Operativo Vigitecol</h1>
            <div className="mb-4">
                <button className="btn btn-info me-2"
                    onClick={() => setVista("menu")}
                >Inicio
                </button>
                <button className="btn btn-primary me-2"
                    onClick={() => setVista("formulario")}
                >Registrar Empleado
                </button>
                <button className="btn btn-secondary me-2"
                    onClick={() => setVista("tabla")}
                >Empleados Activos
                </button>
                <button type="button"
                    className="btn btn-warning me-2"
                    onClick={() => setVista("inactivas")}
                >Empleados Retirados
                </button>
                <button type="button"
                    className="btn btn-success me-2"
                    onClick={() => setVista("administrativos")}
                >ADMINISTRATIVOS
                </button>
            </div>
            {vista === "formulario" && <Formulario />}
            {vista === "tabla" && <Tabla mostrarInactivos={false} />}
            {vista === "inactivas" && <Tabla mostrarInactivos={true} />}
            {vista === "administrativos" && <Tabla mostrarAdministrativos={true} />}
        </div>
    )
};
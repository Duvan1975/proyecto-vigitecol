import { useState } from "react";
import { Formulario } from "./Formulario";
import { Tabla } from "./Tabla";

export function Menu() {
    //Aquí mostramos el componente principal
    const [vista, setVista] = useState("menu");

    return(
        <div className="container">
            <h1 className="alinearTexto">Empleados</h1>
            <div className="mb-4">
                <button className="btn btn-info me-3" 
                onClick={() => setVista("menu")}
                >Inicio
                </button>
                <button className="btn btn-primary me-3" 
                onClick={() => setVista("formulario")}
                >Registrar Empleado
                </button>
                <button className="btn btn-secondary" 
                onClick={() => setVista("tabla")}
                >Listar Empleados
                </button>
            </div>
            {vista === "formulario" && <Formulario />}
            {vista === "tabla" && <Tabla />}
        </div>
    )
};
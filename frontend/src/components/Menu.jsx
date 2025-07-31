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
                >Listar Empleados
                </button>
                <button type="button" 
                className="btn btn-warning " 
                onClick={() => setVista("inactivas")}
                >Empleados Retirados
                </button>
            </div>
            {vista === "formulario" && <Formulario />}
            {vista === "tabla" && <Tabla mostrarInactivos={false} />}
            {vista === "inactivas" && <Tabla mostrarInactivos={true} />}
        </div>
    )
};
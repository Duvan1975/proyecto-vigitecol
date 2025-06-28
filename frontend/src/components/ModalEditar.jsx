import { useEffect, useState } from "react";

export function ModalEditar({ empleado, visible, onClose, onActualizado }) {
    const [formulario, setFormulario] = useState({
        id: "",
        nombres: "",
        apellidos: "",
        tipoDocumento: "",
        numeroDocumento: "",
        fechaNacimiento: "",
        lugarNacimiento: "",
        ciudadExpedicion: "",
        libretaMilitar: "",
        estadoCivil: "",
        genero: "",
        direccion: "",
        telefono: "",
        correo: "",
        tipoEmpleado: "",
        cargo: ""
    });
    useEffect(() => {
        if (empleado) {
            setFormulario(empleado);
        }
    }, [empleado]);

    const handleChange = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
    };
    const actualizarEmpleado = () => {
        fetch("http://localhost:8080/empleados", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formulario)
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error al actualizar");
                return response.json();
            })
            .then((data) => {
                alert(`Empleado ${formulario.nombres} actualizado con éxito`);
                onActualizado(data); // actualiza la tabla
                onClose(); // cierra el modal
            })
            .catch((error) => {
                console.error("Error en la actualización:", error);
                alert("Hubo un error al actualizar la persona");
            });
    };

    if (!visible) return null;

    return (
        <div className="modal" style={{ display: "block", backgroundColor: "#000000aa" }}>
            <div className="modal-dialog">
                <div className="modal-content p-4">
                    <h4>Editar Empleado</h4>
                    <input type="text"
                        name="nombres"
                        value={formulario.nombres}
                        onChange={handleChange}
                        placeholder="Nombres"
                        className="form-control mb-2"
                    />
                    <input type="text"
                        name="apellidos"
                        value={formulario.apellidos}
                        onChange={handleChange}
                        className="form-control mb-2"
                        placeholder="Apellidos"
                    />
                    <input type="text"
                        name="tipoDocumento"
                        value={formulario.tipoDocumento}
                        onChange={handleChange}
                        placeholder="Tipo de Documento"
                    />
                    <input type="number"
                        name="numeroDocumento"
                        value={formulario.numeroDocumento}
                        onChange={handleChange}
                        placeholder="Número de Documento"
                    />
                    <input type="date"
                        name="fechaNacimiento"
                        value={formulario.fechaNacimiento}
                        onChange={handleChange}
                        placeholder="Seleccione la fecha de nacimiento"
                    />
                    <input type="text"
                        name="lugarNacimiento"
                        value={formulario.lugarNacimiento}
                        onChange={handleChange}
                        placeholder="Lugar de Nacimiento"
                    />
                    <input type="text"
                        name="ciudadExpedicion"
                        value={formulario.ciudadExpedicion}
                        onChange={handleChange}
                        placeholder="Ciudad de Expedición"
                    />
                    <input type="text"
                        name="libretaMilitar"
                        value={formulario.libretaMilitar}
                        onChange={handleChange}
                        placeholder="Libreta Militar"
                    />
                    <input type="text"
                        name="estadoCivil"
                        value={formulario.estadoCivil}
                        onChange={handleChange}
                        placeholder="Estado Civilr"
                    />
                    <input type="text"
                        name="genero"
                        value={formulario.genero}
                        onChange={handleChange}
                        placeholder="Género"
                    />
                    <input type="text"
                        name="direccion"
                        value={formulario.direccion}
                        onChange={handleChange}
                        placeholder="Dirección"
                    />
                    <input type="number"
                        name="telefono"
                        value={formulario.telefono}
                        onChange={handleChange}
                        placeholder="Teléfono"
                    />
                    <input type="email"
                        name="correo"
                        value={formulario.correo}
                        onChange={handleChange}
                        placeholder="Correo Electrónico"
                    />
                    <input type="text"
                        name="tipoEmpleado"
                        value={formulario.tipoEmpleado}
                        onChange={handleChange}
                        placeholder="Tipo de Empleado"
                    />
                    <input type="text"
                        name="cargo"
                        value={formulario.cargo}
                        onChange={handleChange}
                        placeholder="Cargo"
                    />
                    <div className="mt-3">
                        <button onClick={actualizarEmpleado} className="btn btn-warning me-2">Actualizar</button>
                        <button onClick={onClose} className="btn btn-secondary">Cancelar</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

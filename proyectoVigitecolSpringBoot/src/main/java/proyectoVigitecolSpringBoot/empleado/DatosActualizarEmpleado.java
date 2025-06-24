package proyectoVigitecolSpringBoot.empleado;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarEmpleado(
        @NotNull
        Long id,
        String nombres,
        String apellidos,
        TipoDocumento tipoDocumento,
        String numeroDocumento,
        LocalDate fechaNacimiento,
        String lugarNacimiento,
        String ciudadExpedicion,
        int edad,
        LibretaMilitar libretaMilitar,
        EstadoCivil estadoCivil,
        Genero genero,
        String direccion,
        String telefono,
        String correo,
        TipoEmpleado tipoEmpleado,
        String cargo
) {
}

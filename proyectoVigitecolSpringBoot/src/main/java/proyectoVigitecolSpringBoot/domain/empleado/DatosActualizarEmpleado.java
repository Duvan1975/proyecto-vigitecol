package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record DatosActualizarEmpleado(
        @NotNull
        Long id,

        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String nombres,

        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String apellidos,

        TipoDocumento tipoDocumento,
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String numeroDocumento,
        LocalDate fechaNacimiento,
        String lugarNacimiento,
        String ciudadExpedicion,
        int edad,
        LibretaMilitar libretaMilitar,
        EstadoCivil estadoCivil,
        Genero genero,
        String direccion,
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String telefono,
        @Email(message = "Debe ser un correo electrónico válido")
        String correo,
        TipoEmpleado tipoEmpleado,
        String cargo
) {
}

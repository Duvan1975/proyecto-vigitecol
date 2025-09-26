package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record DatosRegistroEmpleado(
        @NotBlank
        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
        message = "Debe contener solo letras"
        )
        String nombres,

        @NotBlank
        @Size(min = 2, message = "Debe tener al menos 2 caracteres (letras)")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$",
                message = "Debe contener solo letras"
        )
        String apellidos,

        @NotNull(message = "Debe seleccionar el tipo de documento")
        TipoDocumento tipoDocumento,
        @NotBlank
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String numeroDocumento,
        @NotNull(message = "Debe ingresar la fecha de nacimiento")
        LocalDate fechaNacimiento,
        @NotBlank(message = "Debe ingresar el lugar de nacimiento")
        String lugarNacimiento,
        @NotNull(message = "Debe seleccionar el tipo de población")
        TipoPoblacion tipoPoblacion,
        @NotBlank(message = "Debe ingresar la ciudad de expedición")
        String ciudadExpedicion,
        int edad,
        @NotNull(message = "Debe seleccionar el tipo de libreta militar")
        LibretaMilitar libretaMilitar,
        @NotNull(message = "Debe seleccionar el estado civil")
        EstadoCivil estadoCivil,
        @NotNull(message = "Debe seleccionar el tipo de género")
        Genero genero,
        @NotBlank(message = "Debe ingresar una dirección")
        String direccion,
        @NotBlank
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String telefono,
        @NotBlank
        @Email(message = "Debe ser un correo electrónico válido")
        String correo,
        @NotNull(message = "Debe seleccionar el tipo de empleado")
        TipoEmpleado tipoEmpleado,
        @NotBlank(message = "Debe seleccionar o ingresar el cargo a ocupar")
        String cargo
) {
}

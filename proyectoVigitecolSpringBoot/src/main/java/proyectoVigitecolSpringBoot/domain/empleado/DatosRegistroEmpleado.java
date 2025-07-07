package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record DatosRegistroEmpleado(
        @NotBlank(message = "El nombre no puede estar vacío")
        String nombres,
        @NotBlank(message = "El apellido no puede estar vacío")
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

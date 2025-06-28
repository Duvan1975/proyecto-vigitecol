package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record DatosRespuestaActualizarEmpleado(
        @NotNull
        Long id,
        @NotBlank
        String nombres,
        @NotBlank
        String apellidos,
        @NotNull
        TipoDocumento tipoDocumento,
        @NotBlank
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String numeroDocumento,
        @NotNull
        LocalDate fechaNacimiento,
        @NotBlank
        String lugarNacimiento,
        @NotBlank
        String ciudadExpedicion,
        int edad,
        @NotNull
        LibretaMilitar libretaMilitar,
        @NotNull
        EstadoCivil estadoCivil,
        @NotNull
        Genero genero,
        @NotBlank
        String direccion,
        @NotBlank
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String telefono,
        @Email(message = "Debe ser un correo electrónico válido")
        String correo,
        @NotNull
        TipoEmpleado tipoEmpleado,
        @NotBlank
        String cargo
) {
        public DatosRespuestaActualizarEmpleado(Empleado empleado) {
                this(
                        empleado.getId(),
                        empleado.getNombres(),
                        empleado.getApellidos(),
                        empleado.getTipoDocumento(),
                        empleado.getNumeroDocumento(),
                        empleado.getFechaNacimiento(),
                        empleado.getLugarNacimiento(),
                        empleado.getCiudadExpedicion(),
                        empleado.getEdad(),
                        empleado.getLibretaMilitar(),
                        empleado.getEstadoCivil(),
                        empleado.getGenero(),
                        empleado.getDireccion(),
                        empleado.getTelefono(),
                        empleado.getCorreo(),
                        empleado.getTipoEmpleado(),
                        empleado.getCargo()
                );

        }
}

package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record DatosListadoEmpleado(
        @NotNull
        Long id,
        String foto,
        String nombres,
        String apellidos,
        TipoDocumento tipoDocumento,
        @Pattern(regexp = "\\d{7,15}",message = "Debe contener solo números entre 7 y 15 digitos")
        String numeroDocumento,
        LocalDate fechaNacimiento,
        String lugarNacimiento,
        TipoPoblacion tipoPoblacion,
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
    public DatosListadoEmpleado(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getFoto(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getTipoDocumento(),
                empleado.getNumeroDocumento(),
                empleado.getFechaNacimiento(),
                empleado.getLugarNacimiento(),
                empleado.getTipoPoblacion(),
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

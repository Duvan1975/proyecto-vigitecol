package proyectoVigitecolSpringBoot.empleado;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {

    @Autowired EmpleadoRepository empleadoRepository;

    public void registrarEmpleado(DatosRegistroEmpleado datos) {

        if (empleadoRepository.existsByCorreo(datos.correo())) {
            throw new RuntimeException("Correo duplicado");
        }
        if (empleadoRepository.existsByNumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        empleadoRepository.save(new Empleado(datos));
    }

    public Page<DatosListadoEmpleado> listarEmpleados(Pageable paginacion) {
        return empleadoRepository.findAll(paginacion).map(DatosListadoEmpleado::new);
    }
    @Transactional
    public void actualizarEmpleado(DatosActualizarEmpleado datos) {
        Empleado empleado = empleadoRepository.getReferenceById(datos.id());

        if (datos.nombres() != null) empleado.setNombres(datos.nombres());
        if (datos.apellidos() != null) empleado.setApellidos(datos.apellidos());
        if (datos.tipoDocumento() != null) empleado.setTipoDocumento(datos.tipoDocumento());
        if (datos.numeroDocumento() != null) empleado.setNumeroDocumento(datos.numeroDocumento());
        if (datos.fechaNacimiento() != null) empleado.setFechaNacimiento(datos.fechaNacimiento());
        if (datos.lugarNacimiento() != null) empleado.setLugarNacimiento(datos.lugarNacimiento());
        if (datos.ciudadExpedicion() != null) empleado.setCiudadExpedicion(datos.ciudadExpedicion());
        if (datos.libretaMilitar() != null) empleado.setLibretaMilitar(datos.libretaMilitar());
        if (datos.estadoCivil() != null) empleado.setEstadoCivil(datos.estadoCivil());
        if (datos.genero() != null) empleado.setGenero(datos.genero());
        if (datos.direccion() != null) empleado.setDireccion(datos.direccion());
        if (datos.telefono() != null) empleado.setTelefono(datos.telefono());
        if (datos.correo() != null) empleado.setCorreo(datos.correo());
        if (datos.tipoEmpleado() != null) empleado.setTipoEmpleado(datos.tipoEmpleado());
        if (datos.cargo() != null) empleado.setCargo(datos.cargo());
    }
}

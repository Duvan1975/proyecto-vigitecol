package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.contrato.Contrato;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoRepository;

@Service
public class EmpleadoService {

    @Autowired EmpleadoRepository empleadoRepository;

    @Autowired
    ContratoRepository contratoRepository;

    public void registrarEmpleado(DatosRegistroEmpleado datos) {

        if (empleadoRepository.existsByCorreo(datos.correo())) {
            throw new RuntimeException("Correo duplicado");
        }
        if (empleadoRepository.existsByNumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        empleadoRepository.save(new Empleado(datos));
    }

    public Page<DatosListadoEmpleado> listarEmpleadosActivos(Pageable pageable) {
        Page<Empleado> empleados = contratoRepository.findEmpleadosConContratoActivo(pageable);
        return empleados.map(DatosListadoEmpleado::new);
    }
    @Transactional
    public ResponseEntity actualizarEmpleado(DatosActualizarEmpleado datos) {
        Empleado empleado = empleadoRepository.getReferenceById(datos.id());
        empleado.actualizarDatos(datos);

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

        return ResponseEntity.ok(new DatosRespuestaEmpleado(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getCargo()
        ));
    }
    @Transactional
    public ResponseEntity eliminarEmpleado(Long id) {
        Empleado empleado = empleadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        Contrato contrato = contratoRepository
                .findTopByEmpleadoIdAndContinuaTrueOrderByFechaIngresoDesc(id)
                .orElseThrow(() -> new RuntimeException("Contrato activo no encontrado para este empleado"));

        contrato.setContinua(false);

        return ResponseEntity.noContent().build();
    }
}

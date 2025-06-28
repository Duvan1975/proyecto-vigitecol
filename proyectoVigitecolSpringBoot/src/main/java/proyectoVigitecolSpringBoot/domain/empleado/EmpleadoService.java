package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigitecolSpringBoot.domain.contrato.Contrato;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoRepository;

import java.time.LocalDate;
import java.time.Period;

@Service
public class EmpleadoService {

    @Autowired EmpleadoRepository empleadoRepository;

    @Autowired
    ContratoRepository contratoRepository;

    public ResponseEntity<DatosRespuestaEmpleado> registrarEmpleado(
            DatosRegistroEmpleado datos, UriComponentsBuilder uriComponentsBuilder) {

        if (empleadoRepository.existsByCorreo(datos.correo())) {
            throw new RuntimeException("Correo duplicado");
        }
        if (empleadoRepository.existsByNumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        Empleado empleado = new Empleado(datos); //Aquí creamo el objeto
        empleadoRepository.save(empleado); //Lo guardamos

        //Construímos la URI del recurso creado
        var uri = uriComponentsBuilder.path("/empleados/{id}").buildAndExpand(empleado.getId()).toUri();

        //Creamos la respuesta
        DatosRespuestaEmpleado datosRespuestaEmpleado = new DatosRespuestaEmpleado(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getCargo()
        );

        return ResponseEntity.created(uri).body(datosRespuestaEmpleado);
    }
    public ResponseEntity<Page<DatosListadoEmpleado>> listarEmpleadosActivos(Pageable pageable) {
        Page<Empleado> empleados = contratoRepository.findEmpleadosConContratoActivo(pageable);
        Page<DatosListadoEmpleado> respuesta = empleados.map(DatosListadoEmpleado::new);
        return ResponseEntity.ok(respuesta);
    }
    @Transactional
    public ResponseEntity actualizarEmpleado(DatosActualizarEmpleado datos) {
        Empleado empleado = empleadoRepository.getReferenceById(datos.id());
        empleado.actualizarDatos(datos);

        if (datos.nombres() != null && !datos.nombres().isBlank()) {
            empleado.setNombres(datos.nombres());
        }
        if (datos.apellidos() != null && !datos.apellidos().isBlank()) {
            empleado.setApellidos(datos.apellidos());
        }
        if (datos.tipoDocumento() != null && !datos.tipoDocumento().toString().isBlank()) {
            empleado.setTipoDocumento(datos.tipoDocumento());
        }
        if (datos.numeroDocumento() != null && !datos.numeroDocumento().isBlank()) {
            empleado.setNumeroDocumento(datos.numeroDocumento());
        }
        if (datos.fechaNacimiento() != null) {
            empleado.setFechaNacimiento(datos.fechaNacimiento());
            empleado.setEdad(Period.between(datos.fechaNacimiento(), LocalDate.now()).getYears());
        }
        if (datos.lugarNacimiento() != null && !datos.lugarNacimiento().isBlank()) {
            empleado.setLugarNacimiento(datos.lugarNacimiento());
        }
        if (datos.ciudadExpedicion() != null && !datos.ciudadExpedicion().isBlank()) {
            empleado.setCiudadExpedicion(datos.ciudadExpedicion());
        }
        if (datos.libretaMilitar() != null && !datos.libretaMilitar().toString().isBlank()) {
            empleado.setLibretaMilitar(datos.libretaMilitar());
        }
        if (datos.estadoCivil() != null && !datos.estadoCivil().toString().isBlank()) {
            empleado.setEstadoCivil(datos.estadoCivil());
        }
        if (datos.genero() != null && !datos.genero().toString().isBlank()) {
            empleado.setGenero(datos.genero());
        }
        if (datos.direccion() != null && !datos.direccion().isBlank()) {
            empleado.setDireccion(datos.direccion());
        }
        if (datos.telefono() != null && !datos.telefono().isBlank()) {
            empleado.setTelefono(datos.telefono());
        }
        if (datos.correo() != null && !datos.correo().isBlank()) {
            empleado.setCorreo(datos.correo());
        }
        if (datos.tipoEmpleado() != null && !datos.tipoEmpleado().toString().isBlank()) {
            empleado.setTipoEmpleado(datos.tipoEmpleado());
        }
        if (datos.cargo() != null && !datos.cargo().isBlank()) {
            empleado.setCargo(datos.cargo());
        }

        return ResponseEntity.ok(new DatosRespuestaEmpleado(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                //empleado.getTipoDocumento(),
                empleado.getNumeroDocumento(),
                //empleado.getFechaNacimiento(),
                //empleado.getLugarNacimiento(),
                //empleado.getCiudadExpedicion(),
                empleado.getEdad(),
                //empleado.getLibretaMilitar(),
                empleado.getEstadoCivil(),
                //empleado.getGenero(),
                //empleado.getDireccion(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                //empleado.getTipoEmpleado(),
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
    public ResponseEntity<DatosRespuestaEmpleado>obtenerDatosEmpleado(Long id) {
        Empleado empleado = empleadoRepository.getReferenceById(id);
        var datosEmpleado = new DatosRespuestaEmpleado(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getEdad(),
                empleado.getEstadoCivil(),
                empleado.getTelefono(),
                empleado.getCorreo(),
                empleado.getCargo()
        );
        return ResponseEntity.ok(datosEmpleado);
    }
}

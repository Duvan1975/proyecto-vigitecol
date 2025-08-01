package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigitecolSpringBoot.domain.contrato.Contrato;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoRepository;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.Period;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class EmpleadoService {

    @Autowired
    EmpleadoRepository empleadoRepository;

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
        Empleado empleado = new Empleado(datos); //Aquí creamos el objeto
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

    public ResponseEntity<Page<DatosListadoEmpleado>> listarEmpleadosInactivos(Pageable pageable) {
        Page<Empleado> empleados = contratoRepository.findEmpleadosConContratoInactivo(pageable);
        Page<DatosListadoEmpleado> respuesta = empleados.map(DatosListadoEmpleado::new);
        return ResponseEntity.ok(respuesta);
    }

    @Transactional
    public ResponseEntity actualizarEmpleado(DatosActualizarEmpleado datos) {
        Empleado empleado = empleadoRepository.getReferenceById(datos.id());
        empleado.actualizarDatos(datos);

        if (datos.nombres() != null && !datos.nombres().isBlank()) {
            empleado.setNombres(datos.nombres().trim());
        }
        if (datos.apellidos() != null && !datos.apellidos().isBlank()) {
            empleado.setApellidos(datos.apellidos().trim());
        }
        if (datos.tipoDocumento() != null && !datos.tipoDocumento().toString().isBlank()) {
            empleado.setTipoDocumento(datos.tipoDocumento());
        }
        if (datos.numeroDocumento() != null && !datos.numeroDocumento().isBlank()) {
            boolean documentoDuplicado = empleadoRepository.existsByNumeroDocumento(datos.numeroDocumento())
                    && !datos.numeroDocumento().equalsIgnoreCase(empleado.getNumeroDocumento());
            if (documentoDuplicado) {
                throw new RuntimeException("El número de documento, ya existe");
            }
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
        // Validar que el correo no esté registrado en otro empleado
        if (datos.correo() != null && !datos.correo().isBlank()) {
            boolean correoDuplicado = empleadoRepository.existsByCorreo(datos.correo())
                    && !datos.correo().equalsIgnoreCase(empleado.getCorreo());

            if (correoDuplicado) {
                throw new RuntimeException("El correo ya existe");
            }

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

    public ResponseEntity<DatosActualizarEmpleado> obtenerDatosEmpleadoActivo(Long id) {
        var empleado = contratoRepository.findEmpleadoActivoPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Empleado Activo NO encontrado"));

        var datosEmpleado = new DatosActualizarEmpleado(
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
        return ResponseEntity.ok(datosEmpleado);
    }

    public ResponseEntity<DatosActualizarEmpleado> obtenerDatosEmpleadoInactivo(Long id) {
        var empleado = contratoRepository.findEmpleadoInactivoPorId(id)
                .orElseThrow(() -> new EntityNotFoundException("Empleado Inactivo NO encontrado"));

        var datosEmpleado = new DatosActualizarEmpleado(
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
        return ResponseEntity.ok(datosEmpleado);
    }

    // Método para quitar acentos
    private String quitarTildes(String texto) {
        String textoNormalizado = Normalizer.normalize(texto, Normalizer.Form.NFD);
        Pattern patron = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        return patron.matcher(textoNormalizado).replaceAll("");
    }

    public ResponseEntity<List<DatosActualizarEmpleado>> buscarEmpleadosActivosPorNombre(String filtro) {
        var empleados = contratoRepository.buscarTodosEmpleadosActivos();

        var palabras = filtro.toLowerCase().split("\\s+");

        var empleadosFiltrados = empleados.stream()
                .filter(empleado -> {
                    String nombreCompleto = quitarTildes((empleado.getNombres() + " " + empleado.getApellidos()).toLowerCase());
                    return Arrays.stream(palabras).allMatch(nombreCompleto::contains);
                })
                .map(empleado -> new DatosActualizarEmpleado(
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
                ))
                .toList();

        return ResponseEntity.ok(empleadosFiltrados);
    }

    public ResponseEntity<List<DatosActualizarEmpleado>> buscarEmpleadoActivoPorNumeroDocumento(String numeroDocumento) {
        var empleados = contratoRepository.buscarEmpleadoActivoPorNumeroDocumento(numeroDocumento);

        // Si no se encuentra nada, devolvemos lista vacía con estado 200 OK
        if (empleados.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        var resultado = empleados.stream()
                .map(empleado -> new DatosActualizarEmpleado(
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
                )).toList();

        return ResponseEntity.ok(resultado);
    }

    public ResponseEntity<List<DatosActualizarEmpleado>> buscarEmpleadosInactivosPorNombre(String filtro) {
        var empleados = contratoRepository.buscarTodosEmpleadosInactivos();

        var palabras = filtro.toLowerCase().split("\\s+");

        var empleadosFiltrados = empleados.stream()
                .filter(empleado -> {
                    String nombreCompleto = quitarTildes((empleado.getNombres() + " " + empleado.getApellidos()).toLowerCase());
                    return Arrays.stream(palabras).allMatch(nombreCompleto::contains);
                })
                .map(empleado -> new DatosActualizarEmpleado(
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
                ))
                .toList();

        return ResponseEntity.ok(empleadosFiltrados);
    }

    public ResponseEntity<List<DatosActualizarEmpleado>> buscarEmpleadoInactivoPorNumeroDocumento(String numeroDocumento) {
        var empleados = contratoRepository.buscarEmpleadoInactivoPorNumeroDocumento(numeroDocumento);

        // Si no se encuentra nada, devolvemos lista vacía con estado 200 OK
        if (empleados.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        var resultado = empleados.stream()
                .map(empleado -> new DatosActualizarEmpleado(
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
                )).toList();

        return ResponseEntity.ok(resultado);
    }

    //Listar empleados sin contrato
    public ResponseEntity<Page<DatosListadoEmpleado>> listarEmpleadosSinContrato(Pageable pageable) {
        Page<Empleado> empleados = empleadoRepository.findEmpleadosSinContrato(pageable);
        Page<DatosListadoEmpleado> respuesta = empleados.map(DatosListadoEmpleado::new);
        return ResponseEntity.ok(respuesta);
    }

    public ResponseEntity<Page<DatosListadoEmpleado>> listarAdministrativosActivos(Pageable pageable) {
        Page<Empleado> empleados = contratoRepository.findAdministrativosConContratoActivo(pageable);
        Page<DatosListadoEmpleado> respuesta = empleados.map(DatosListadoEmpleado::new);
        return ResponseEntity.ok(respuesta);
    }
}

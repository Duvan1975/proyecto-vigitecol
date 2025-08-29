package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigitecolSpringBoot.domain.contrato.Contrato;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoRepository;
import proyectoVigitecolSpringBoot.domain.contrato.DatosContratoDTO;
import proyectoVigitecolSpringBoot.domain.curso.Curso;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.Period;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class EmpleadoService {

    /*@Autowired
    EmpleadoRepository empleadoRepository;*/

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoService(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

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

    public ResponseEntity<Page<DatosListadoEmpleado>> listarOperativosActivos(Pageable pageable) {
        Page<Empleado> empleados = contratoRepository.findOperativosConContratoActivo(pageable);
        Page<DatosListadoEmpleado> respuesta = empleados.map(DatosListadoEmpleado::new);
        return ResponseEntity.ok(respuesta);
    }

    public ResponseEntity<Page<DatosListadoEmpleado>> listarSupervisoresActivos(Pageable pageable) {
        Page<Empleado> empleados = contratoRepository.findSupervisoresConContratoActivo(pageable);
        Page<DatosListadoEmpleado> respuesta = empleados.map(DatosListadoEmpleado::new);
        return ResponseEntity.ok(respuesta);
    }

    public Page<DatosListadoEmpleado> listarEmpleadosActivosMayoresDe50(
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {
        Page<Empleado> empleados = contratoRepository
                .findEmpleadosConContratoActivoMayoresDe50(tipoEmpleado, pageable);
        return empleados.map(DatosListadoEmpleado::new);
    }

    public Page<DatosListadoEmpleado> listarEmpleadosActivosPorEstadoCivil(
            EstadoCivil estadoCivil,
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {

        Page<Empleado> empleados = contratoRepository
                .findEmpleadosPorEstadoCivilConContratoActivo(estadoCivil, tipoEmpleado, pageable);
        return empleados.map(DatosListadoEmpleado::new);
    }

    public Page<DatosListadoEmpleado> listarEmpleadosActivosPorGenero(
            Genero genero,
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {

        Page<Empleado> empleados = contratoRepository
                .findEmpleadosPorGeneroConContratoActivo(genero, tipoEmpleado, pageable);
        return empleados.map(DatosListadoEmpleado::new);
    }

    public Page<DatosListadoEmpleado> listarEmpleadosActivosPorLibretaMilitar(
            LibretaMilitar libretaMilitar,
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {

        Page<Empleado> empleados = contratoRepository
                .findEmpleadosPorLibretaMilitarConContratoActivo(libretaMilitar, tipoEmpleado, pageable);
        return empleados.map(DatosListadoEmpleado::new);
    }

    public Page<DatosListadoEmpleado> listarEmpleadosActivosPorCargo(
            String cargo,
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {

        // Normaliza el cargo: elimina espacios extras y convierte a minúsculas
        String cargoBusqueda = cargo.trim()
                .replaceAll("\\s+", " ") // Reemplaza múltiples espacios por uno
                .toLowerCase();

        Page<Empleado> empleados = contratoRepository
                .findEmpleadosPorCargoConContratoActivo(cargoBusqueda, tipoEmpleado, pageable);

        return empleados.map(DatosListadoEmpleado::new);
    }

    public Page<DatosEmpleadoConFamiliaresMenoresDe12> findConFamiliares(
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {
        return empleadoRepository.findEmpleadosConFamiliares(tipoEmpleado, pageable)
                .map(DatosEmpleadoConFamiliaresMenoresDe12::new);
    }

    public Page<DatosEmpleadoConFamiliaresMenoresDe12> listarFamiliaresMenoresDe12(
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {
        return empleadoRepository.findEmpleadosConFamiliaresMenoresDe12(tipoEmpleado, pageable)
                .map(DatosEmpleadoConFamiliaresMenoresDe12::new);
    }

    public Page<DatosEmpleadoConFamiliares> obtenerEmpleadosConTodosFamiliares(
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {

        Page<Empleado> empleados = empleadoRepository.findConTodosLosFamiliares(
                tipoEmpleado,
                pageable
        );

        return empleados.map(DatosEmpleadoConFamiliares::new);
    }

    public Page<DatosEmpleadoConFamiliares> listarEmpleadosConFamiliaresPorGenero(
            Genero genero,
            TipoEmpleado tipoEmpleado,
            Pageable pageable) {

        Page<Empleado> empleados = contratoRepository
                .findEmpleadosConFamiliaresPorGenero(genero, tipoEmpleado, pageable);
        return empleados.map(DatosEmpleadoConFamiliares::new);
    }

    public Page<DatosEmpleadoConCurso> findConCurso(Pageable pageable) {
        return empleadoRepository.findEmpleadosConCurso(pageable)
                .map(DatosEmpleadoConCurso::new);
    }


    public Page<DatosEmpleadoConCurso> findEmpleadosConCursosPorVencer(Pageable pageable) {
        LocalDate hoy = LocalDate.now();
        LocalDate fechaLimite = hoy.plusDays(30);
        LocalDate hace30Dias = hoy.minusDays(30);
        LocalDate ayer = hoy.minusDays(1);

        return empleadoRepository.findEmpleadosConCursosPorVencer(hoy, fechaLimite, hace30Dias, ayer, pageable)
                .map(empleado -> {
                    // Tomar solo el curso más reciente
                    Optional<Curso> cursoMasReciente = empleado.getCursos().stream()
                            .max(Comparator.comparing(Curso::getCursoId));

                    List<DatosCursoDTO> cursosVigentes = cursoMasReciente
                            .map(DatosCursoDTO::new)
                            .stream()
                            .toList();

                    return new DatosEmpleadoConCurso(
                            empleado.getId(),
                            empleado.getNombres(),
                            empleado.getApellidos(),
                            empleado.getNumeroDocumento(),
                            empleado.getTelefono(),
                            empleado.getCargo(),
                            cursosVigentes.size(),
                            cursosVigentes
                    );
                });
    }

    public Page<DatosEmpleadoConPeriodoDePrueba> findEmpleadosEnPeriodoDePrueba(Pageable pageable) {
        LocalDate fechaMin = LocalDate.now().minusDays(60);
        LocalDate fechaMax = LocalDate.now().minusDays(45);

        return empleadoRepository.findEmpleadosEnPeriodoDePruebaVencido(fechaMin, fechaMax, pageable)
                .map(empleado -> {
                    // Sólo el contrato número 1
                    List<DatosContratoDTO> contratoPeriodoDePrueba = empleado.getContratos().stream()
                            .filter(c -> c.getNumeroContrato() == 1)
                            .map(DatosContratoDTO::new)
                            .toList();

                    return new DatosEmpleadoConPeriodoDePrueba(
                            empleado.getId(),
                            empleado.getNombres(),
                            empleado.getApellidos(),
                            empleado.getNumeroDocumento(),
                            empleado.getTelefono(),
                            empleado.getCargo(),
                            contratoPeriodoDePrueba
                    );
                });
    }

    public Page<DatosEmpleadoConEstudios> findConEstudios(Pageable pageable) {
        return empleadoRepository.findEmpleadosConEstudios(pageable)
                .map(DatosEmpleadoConEstudios::new);
    }
}

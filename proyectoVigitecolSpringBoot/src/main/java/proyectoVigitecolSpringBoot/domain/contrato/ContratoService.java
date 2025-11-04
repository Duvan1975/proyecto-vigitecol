package proyectoVigitecolSpringBoot.domain.contrato;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioService;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class ContratoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private HistorialRepository historialRepository;

    public void registrarContrato(Long empleadoId, DatosRegistroContrato datos) {
        var empleado = empleadoRepository.findById(empleadoId)
            .orElseThrow(() -> new RuntimeException("Persona NO encontrada"));

        //Obtener el número del último contrato
        Integer ultimoNumeroContrato = contratoRepository.obtenerUltimoNumeroContratoPorEmpleado(empleadoId);
        int nuevoNumeroContrato = (ultimoNumeroContrato == null) ? 1 : ultimoNumeroContrato + 1;

        //Crear contrato con el número asignado
        Contrato contrato = new Contrato(datos, empleado);
        contrato.setNumeroContrato(nuevoNumeroContrato);

        contratoRepository.save(contrato);

        String actor = usuarioService.obtenerUsuarioActual();
        historialRepository.save(new HistorialAccion(
                actor,
                "REGISTRAR_CONTRATO",
                "Registró un nuevo contrato N° " + nuevoNumeroContrato + " para el empleado: " + empleado.getNombres() +" "+ empleado.getApellidos()
        ));
    }
    public ResponseEntity<Page<DatosListadoContrato>> listarContratos(@PageableDefault(size = 10) Pageable paginacion) {
        return ResponseEntity.ok(contratoRepository.findAll(paginacion).map(DatosListadoContrato::new));
    }
    public List<DatosListadoContrato> obtenerContratosPorEmpleado(Long empleadoId) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado o está inactivo"));
        return empleado.getContratos()
                .stream()
                .map(DatosListadoContrato::new)
                .toList();
    }
    @Transactional
    public DatosRespuestaContrato actualizarContrato(DatosActualizarContrato datos) {
        Optional<Contrato> optionalContrato = contratoRepository.findById(datos.id());

        if (optionalContrato.isEmpty()) {
            throw new EntityNotFoundException("Contrato no encontrado con ID: " + datos.id());
        }

        Contrato contrato = optionalContrato.get();
        Boolean estadoAnterior = contrato.getContinua();
        contrato.actualizarDatos(datos);

        String actor = usuarioService.obtenerUsuarioActual();
        Boolean nueva = datos.continua();
        if (nueva != null && !nueva.equals(estadoAnterior)) {
            historialRepository.save(new HistorialAccion(
                    actor,
                    "CAMBIO_ESTADO_CONTRATO",
                    "El contrato N° " + contrato.getNumeroContrato() + " del empleado "
                            + contrato.getEmpleado().getNombres() + " "
                            + contrato.getEmpleado().getApellidos() + " cambió su estado a "
                            + (contrato.getContinua() ? "ACTIVO" : "FINALIZADO")
            ));
        } else {
            historialRepository.save(new HistorialAccion(
                    actor,
                    "ACTUALIZAR_CONTRATO",
                    "Actualizó el contrato con ID: " + contrato.getContratoId()
                            + " (Contrato N° " + contrato.getNumeroContrato() + ")"
            ));
        }

        return new DatosRespuestaContrato(
                contrato.getContratoId(),
                contrato.getNumeroContrato(),
                contrato.getFechaIngreso(),
                contrato.getFechaRetiro(),
                contrato.getFechaRenuncia(),
                contrato.getFechaOtroSi(),
                contrato.getOmiso(),
                contrato.getContinua(),
                contrato.getVacacionesDesde(),
                contrato.getVacacionesHasta()
        );
    }

    public DatosListadoContrato obtenerUltimoContratoPorEmpleado(Long empleadoId) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado o está inactivo"));

        //Aquí compara y retorna el último contrato más reciente
        return empleado.getContratos()
                .stream()
                .max(Comparator.comparingInt(Contrato::getNumeroContrato))
                .map(DatosListadoContrato::new)
                .orElseThrow(() -> new RuntimeException("El empleado NO tiene contratos registrados"));
    }
    public void eliminarContrato(Long id) {
        if (!contratoRepository.existsById(id)) {
            throw new EntityNotFoundException("Contrato no encontrado con ID: " + id);
        }
        contratoRepository.deleteById(id);

        String actor = usuarioService.obtenerUsuarioActual();
        historialRepository.save(new HistorialAccion(
                actor,
                "ELIMINAR_CONTRATO",
                "Eliminó el contrato con ID: " + id
        ));
    }
}

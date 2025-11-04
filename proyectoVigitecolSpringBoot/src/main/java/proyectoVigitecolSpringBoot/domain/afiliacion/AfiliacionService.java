package proyectoVigitecolSpringBoot.domain.afiliacion;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;
import proyectoVigitecolSpringBoot.domain.usuarios.UsuarioService;

import java.util.List;
import java.util.Optional;

@Service
public class AfiliacionService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private AfiliacionRepository afiliacionRepository;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private HistorialRepository historialRepository;

    public void registrarAfiliacion(Long empleadoId, List<DatosRegistroAfiliacion> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<Afiliacion> afiliaciones = listaDatos.stream()
                .map(datos -> new Afiliacion(datos, empleado))
                .toList();
        afiliacionRepository.saveAll(afiliaciones);

        String actor = usuarioService.obtenerUsuarioActual();

        historialRepository.save(new HistorialAccion(
                actor,
                "REGISTRAR_AFILIACION",
                "Registró afiliaciones del empleado: " + empleado.getNombres() +" "+ empleado.getApellidos()
        ));
    }

    public Page<Afiliacion> listarAfiliaciones(Pageable paginacion) {
        return afiliacionRepository.findAll(paginacion);
    }

    public List<DatosListadoAfiliacion> obtenerAfiliacionesPorEmpleadoActivo(Long empleadoId) {
        var afiliaciones = afiliacionRepository.findAfiliacionByEmpleadoActivo(empleadoId);

        if (afiliaciones.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin afiliaciones registradas");
        }
        return afiliaciones.stream()
                .map(DatosListadoAfiliacion::new)
                .toList();
    }

    @Transactional
    public DatosRespuestaAfiliacion actualizarAfiliacion(DatosActualizarAfiliacion datos) {
        Optional<Afiliacion> optionalAfiliacion = afiliacionRepository.findById(datos.id());

        if (optionalAfiliacion.isEmpty()) {
            throw new EntityNotFoundException("Afiliación no encontrado con ID: " + datos.id());
        }
        Afiliacion afiliacion = optionalAfiliacion.get();
        afiliacion.actualizarDatos(datos);

        afiliacionRepository.save(afiliacion);

        String actor = usuarioService.obtenerUsuarioActual();
        historialRepository.save(new HistorialAccion(
                actor,
                "ACTUALIZAR_AFILIACION",
                "Actualizó la afiliación con ID: " + afiliacion.getAfiliacionId()
        ));

        return new DatosRespuestaAfiliacion(
                afiliacion.getAfiliacionId(),
                afiliacion.getTipoAfiliacion(),
                afiliacion.getNombreEntidad(),
                afiliacion.getFechaAfiliacion()
        );
    }

    public void eliminarAfiliacion(Long id) {
        if (!afiliacionRepository.existsById(id)) {
            throw new EntityNotFoundException("Afiliación no encontrada con ID: " + id);
        }
        afiliacionRepository.deleteById(id); // Devuelve 204 No Content

        String actor = usuarioService.obtenerUsuarioActual();
        historialRepository.save(new HistorialAccion(
                actor,
                "ELIMINAR_AFILIACION",
                "Eliminó la afiliación con ID: " + id
        ));
    }
}

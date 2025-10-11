package proyectoVigitecolSpringBoot.domain.estudio;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class EstudioService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private EstudioRepository estudioRepository;

    public void resgistrarEstudio(Long empleadoId, List<DatosRegistroEstudio> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<Estudio> estudios = listaDatos.stream()
                .map(datos -> new Estudio(datos, empleado))
                .toList();
        estudioRepository.saveAll(estudios);
    }

    public Page<Estudio> listarEstudios(Pageable paginacion) {
        return estudioRepository.findAll(paginacion);
    }

    public List<DatosListadoEstudio> obtenerEstudiosPorEmpleadoActivo(Long empleadoId) {
        var estudios = estudioRepository.findEstudiosByEmpleadoActivo(empleadoId);

        if (estudios.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin estudios registrados");
        }
        return estudios.stream()
                .map(DatosListadoEstudio::new)
                .toList();
    }

    @Transactional
    public DatosRespuestaEstudio actualizarEstudio(DatosActualizarEstudio datos) {
        Optional<Estudio> optionalEstudio = estudioRepository.findById(datos.id());

        if (optionalEstudio.isEmpty()) {
            throw new EntityNotFoundException("Estudio no encontrado con ID: " + datos.id());
        }
        Estudio estudio = optionalEstudio.get();
        estudio.actualizarDatos(datos);

        return new DatosRespuestaEstudio(
                estudio.getEstudioId(),
                estudio.getTipoEstudio(),
                estudio.getNombreEstudio(),
                estudio.getFechaEstudio()
        );
    }

    public void eliminarEstudio(Long id) {
        if (!estudioRepository.existsById(id)) {
            throw new EntityNotFoundException("Estudio no encontrado con ID: " + id);
        }
        estudioRepository.deleteById(id); // Devuelve 204 No Content
    }
}

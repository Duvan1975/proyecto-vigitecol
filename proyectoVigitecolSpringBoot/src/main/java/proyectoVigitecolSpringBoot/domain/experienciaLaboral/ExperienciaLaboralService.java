package proyectoVigitecolSpringBoot.domain.experienciaLaboral;

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
public class ExperienciaLaboralService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private ExperienciaLaboralRepository experienciaLaboralRepository;

    public void resgistrarExperienciaLaboral(Long empleadoId, List<DatosRegistroExperienciaLaboral> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<ExperienciaLaboral> experienciaLaboral = listaDatos.stream()
                .map(datos -> new ExperienciaLaboral(datos, empleado))
                .toList();
        experienciaLaboralRepository.saveAll(experienciaLaboral);
    }

    public Page<ExperienciaLaboral> listarExperienciasLaborales(Pageable paginacion) {
        return experienciaLaboralRepository.findAll(paginacion);
    }

    public List<DatosListadoExperienciaLaboral> obtenerExperienciaLaboralPorEmpleadoActivo(Long empleadoId) {
        var experienciaLaboral = experienciaLaboralRepository.findExperienciaLaboralByEmpleadoActivo(empleadoId);

        if (experienciaLaboral.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin experiencia laboral registrados");
        }
        return experienciaLaboral.stream()
                .map(DatosListadoExperienciaLaboral::new)
                .toList();
    }

    @Transactional
    public DatosRespuestaExperienciaLaboral actualizarExperienciaLaboral(DatosActualizarExperienciaLaboral datos) {
        Optional<ExperienciaLaboral> optionalExperienciaLaboral = experienciaLaboralRepository.findById(datos.id());

        if (optionalExperienciaLaboral.isEmpty()) {
            throw new EntityNotFoundException("Experiencia Laboral no encontrada con ID: " + datos.id());
        }
        ExperienciaLaboral experienciaLaboral = optionalExperienciaLaboral.get();
        experienciaLaboral.actualizarDatos(datos);

        return new  DatosRespuestaExperienciaLaboral(
                experienciaLaboral.getExperienciaLaboralId(),
                experienciaLaboral.getDescripcionExperiencia()
        );
    }

    public void eliminarExperienciaLaboral(Long id) {
        if (!experienciaLaboralRepository.existsById(id)) {
            throw new EntityNotFoundException("Experiencia Laboral no encontrado con ID: " + id);
        }
        experienciaLaboralRepository.deleteById(id); // Devuelve 204 No Content
    }
}


package proyectoVigitecolSpringBoot.domain.curso;

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
public class CursoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public void resgistrarCurso(Long empleadoId, List<DatosRegistroCurso> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<Curso> cursos = listaDatos.stream()
                .map(datos -> new Curso(datos, empleado))
                .toList();
        cursoRepository.saveAll(cursos);
    }

    public Page<Curso> listarCursos(Pageable paginacion) {
        return cursoRepository.findAll(paginacion);
    }

    public List<DatosListadoCurso> obtenerCursosPorEmpleadoActivo(Long empleadoId) {
        var cursos = cursoRepository.findCursosByEmpleadoActivo(empleadoId);

        if (cursos.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin cursos registrados");
        }
        return cursos.stream()
                .map(DatosListadoCurso::new)
                .toList();
    }
    @Transactional
    public DatosRespuestaCurso actualizarCurso(DatosActualizarCurso datos) {
        Optional<Curso> optionalCurso = cursoRepository.findById(datos.id());

        if (optionalCurso.isEmpty()) {
            throw new EntityNotFoundException("Curso no encontrado con ID: " + datos.id());
        }
        Curso curso = optionalCurso.get();
        curso.actualizarDatos(datos);

        return new DatosRespuestaCurso(
                curso.getCursoId(),
                curso.getTipoCurso(),
                curso.getCategoria(),
                curso.getFechaCurso(),
                curso.getFuncionEspecifica()
        );
    }
    public void eliminarCurso(Long id) {
        if (!cursoRepository.existsById(id)) {
            throw new EntityNotFoundException("Curso no encontrado con ID: " + id);
        }
        cursoRepository.deleteById(id); // Devuelve 204 No Content
    }
}

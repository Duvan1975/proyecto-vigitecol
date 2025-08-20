package proyectoVigitecolSpringBoot.domain.curso;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;

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
}

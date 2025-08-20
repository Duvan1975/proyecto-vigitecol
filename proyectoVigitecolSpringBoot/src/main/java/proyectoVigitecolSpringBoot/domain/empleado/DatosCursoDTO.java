package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.curso.Curso;

import java.time.LocalDate;

public record DatosCursoDTO(
        String tipoCurso,
        String categoria,
        LocalDate fechaCurso
) {
    public DatosCursoDTO(Curso curso) {
        this(
                curso.getTipoCurso().toString(),
                curso.getCategoria().toString(),
                curso.getFechaCurso()
        );
    }
}

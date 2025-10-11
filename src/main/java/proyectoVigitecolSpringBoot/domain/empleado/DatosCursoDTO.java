package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.curso.Curso;

import java.time.LocalDate;

public record DatosCursoDTO(
        String tipoCurso,
        String categoria,
        LocalDate fechaCurso,
        String funcionEspecifica,
        boolean vencido
) {
    public DatosCursoDTO(Curso curso) {
        this(
                curso.getTipoCurso().toString(),
                curso.getCategoria().toString(),
                curso.getFechaCurso(),
                curso.getFuncionEspecifica(),
                curso.getFechaCurso().plusYears(1).isBefore(LocalDate.now())
        );
    }
}

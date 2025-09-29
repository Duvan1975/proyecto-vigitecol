package proyectoVigitecolSpringBoot.domain.curso;

import java.time.LocalDate;

public record DatosListadoCurso(
        Long cursoId,
        TipoCurso tipoCurso,
        Categoria categoria,
        LocalDate fechaCurso,
        String funcionEspecifica,
        String nombreEmpleado,
        String apellidoEmpleado,
        String documentoEmpleado
) {
    public DatosListadoCurso(Curso curso) {
        this(
                curso.getCursoId(),
                curso.getTipoCurso(),
                curso.getCategoria(),
                curso.getFechaCurso(),
                curso.getFuncionEspecifica(),
                curso.getEmpleado().getNombres(),
                curso.getEmpleado().getApellidos(),
                curso.getEmpleado().getNumeroDocumento()
        );
    }
}

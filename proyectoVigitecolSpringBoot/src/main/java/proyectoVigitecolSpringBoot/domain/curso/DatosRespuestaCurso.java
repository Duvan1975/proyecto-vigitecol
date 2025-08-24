package proyectoVigitecolSpringBoot.domain.curso;

import java.time.LocalDate;

public record DatosRespuestaCurso(
        Long cursoId,
        TipoCurso tipoCurso,
        Categoria categoria,
        LocalDate fechaCurso
) {
}

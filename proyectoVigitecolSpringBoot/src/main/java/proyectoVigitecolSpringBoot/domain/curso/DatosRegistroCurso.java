package proyectoVigitecolSpringBoot.domain.curso;

import java.time.LocalDate;

public record DatosRegistroCurso(
        TipoCurso tipoCurso,
        Categoria categoria,
        LocalDate fechaCurso
) {
}

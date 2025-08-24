package proyectoVigitecolSpringBoot.domain.curso;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosActualizarCurso(
        @NotNull
        Long id,
        TipoCurso tipoCurso,
        Categoria categoria,
        LocalDate fechaCurso
) {
}

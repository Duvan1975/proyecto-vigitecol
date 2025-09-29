package proyectoVigitecolSpringBoot.domain.curso;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record DatosRegistroCurso(
        TipoCurso tipoCurso,
        Categoria categoria,

        @NotNull
        LocalDate fechaCurso,

        String funcionEspecifica
) {
}

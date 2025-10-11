package proyectoVigitecolSpringBoot.domain.estudio;

import java.time.LocalDate;

public record DatosRespuestaEstudio(
        Long estudioId,
        TipoEstudio tipoEstudio,
        String nombreEstudio,
        LocalDate fechaEstudio
) {
}

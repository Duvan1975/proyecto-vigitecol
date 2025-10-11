package proyectoVigitecolSpringBoot.domain.familia;

public record DatosRespuestaFamiliar(
        Long familiarId,
        TipoFamiliar tipoFamiliar,
        String nombreFamiliar,
        int edadFamiliar
) {
}

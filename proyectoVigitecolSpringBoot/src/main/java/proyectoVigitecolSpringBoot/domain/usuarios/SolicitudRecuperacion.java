package proyectoVigitecolSpringBoot.domain.usuarios;

public record SolicitudRecuperacion(
        String admin,
        String token,
        String nuevaClave
) {
}

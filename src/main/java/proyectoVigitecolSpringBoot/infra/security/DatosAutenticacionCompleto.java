package proyectoVigitecolSpringBoot.infra.security;

public record DatosAutenticacionCompleto(
        String token,
        String rol,
        boolean estado,
        String admin
) {
}

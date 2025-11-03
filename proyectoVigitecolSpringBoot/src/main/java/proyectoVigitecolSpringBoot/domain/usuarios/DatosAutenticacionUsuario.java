package proyectoVigitecolSpringBoot.domain.usuarios;

public record DatosAutenticacionUsuario(
        String nombreUsuario,
        String admin,
        String clave
) {
}

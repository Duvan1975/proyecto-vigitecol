package proyectoVigitecolSpringBoot.domain.empleado;

import java.util.List;

public record DatosEmpleadoConDocumentos(
        Long id,
        String nombres,
        String apellidos,
        String numeroDocumento,
        String telefono,
        String cargo,
        int numeroDeDocumentos,
        List<DatosDocumentoDTO> documentos
) {
    public DatosEmpleadoConDocumentos(Empleado empleado) {
        this(
                empleado.getId(),
                empleado.getNombres(),
                empleado.getApellidos(),
                empleado.getNumeroDocumento(),
                empleado.getTelefono(),
                empleado.getCargo(),
                empleado.getDocumentos().size(),
                empleado.getDocumentos().stream()
                        .map(DatosDocumentoDTO::new)
                        .toList()
        );
    }
}

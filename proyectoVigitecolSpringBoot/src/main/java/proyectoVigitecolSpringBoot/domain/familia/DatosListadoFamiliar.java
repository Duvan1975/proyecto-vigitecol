package proyectoVigitecolSpringBoot.domain.familia;

public record DatosListadoFamiliar(
        Long familiarId,
        TipoFamiliar tipoFamiliar,
        String nombreFamiliar,
        int edadFamiliar,
        String nombrePersona,
        String apellidoPersona,
        String documentoPersona
) {
    public DatosListadoFamiliar(Familiar familiar){
        this(
                familiar.getFamiliarId(),
                familiar.getTipoFamiliar(),
                familiar.getNombreFamiliar(),
                familiar.getEdadFamiliar(),
                familiar.getEmpleado().getNombres(),
                familiar.getEmpleado().getApellidos(),
                familiar.getEmpleado().getNumeroDocumento()
        );
    }
}

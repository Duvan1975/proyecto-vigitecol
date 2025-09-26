package proyectoVigitecolSpringBoot.domain.empleado;

import proyectoVigitecolSpringBoot.domain.afiliacion.DatosListadoAfiliacion;
import proyectoVigitecolSpringBoot.domain.contrato.DatosListadoContrato;
import proyectoVigitecolSpringBoot.domain.curso.DatosListadoCurso;
import proyectoVigitecolSpringBoot.domain.estudio.DatosListadoEstudio;
import proyectoVigitecolSpringBoot.domain.experienciaLaboral.DatosListadoExperienciaLaboral;
import proyectoVigitecolSpringBoot.domain.familia.DatosListadoFamiliar;
import proyectoVigitecolSpringBoot.domain.otroDocumento.DatosListadoOtroDocumento;
import proyectoVigitecolSpringBoot.domain.vehiculo.DatosListadoVehiculo;

import java.util.List;

public record DatosEmpleadoCompletoDTO(
        DatosListadoEmpleado empleado,
        List<DatosListadoContrato> contrato,
        List<DatosListadoFamiliar> familiar,
        List<DatosListadoCurso> curso,
        List<DatosListadoEstudio> estudio,
        List<DatosListadoExperienciaLaboral> experienciaLaboral,
        List<DatosListadoAfiliacion> afiliacion,
        List<DatosListadoOtroDocumento> otroDocumento,
        List<DatosListadoVehiculo> vehiculo
) {
}

package proyectoVigitecolSpringBoot.domain.afiliacion;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;

@Service
public class AfiliacionService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private AfiliacionRepository afiliacionRepository;

    /*public void registrarAfiliacion(Long empleadoId, DatosRegistroAfiliacion datos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(()-> new RuntimeException("Empleado NO encontrado"));
        var afiliacion = new Afiliacion(datos, empleado);
        afiliacionRepository.save(afiliacion);
    }*/

    public void registrarAfiliacion(Long empleadoId, List<DatosRegistroAfiliacion> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<Afiliacion> afiliaciones = listaDatos.stream()
                .map(datos -> new Afiliacion(datos, empleado))
                .toList();
        afiliacionRepository.saveAll(afiliaciones);
    }

    public Page<Afiliacion> listarAfiliaciones(Pageable paginacion) {
        return afiliacionRepository.findAll(paginacion);
    }

    public List<DatosListadoAfiliacion> obtenerAfiliacionesPorEmpleadoActivo(Long empleadoId) {
        var afiliaciones = afiliacionRepository.findAfiliacionByEmpleadoActivo(empleadoId);

        if (afiliaciones.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin afiliaciones registradas");
        }
        return afiliaciones.stream()
                .map(DatosListadoAfiliacion::new)
                .toList();
    }
}

package proyectoVigitecolSpringBoot.empleado;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpleadoService {

    @Autowired EmpleadoRepository empleadoRepository;

    public void registrarEmpleado(DatosRegistroEmpleado datos) {

        if (empleadoRepository.existsByCorreo(datos.correo())) {
            throw new RuntimeException("Correo duplicado");
        }
        if (empleadoRepository.existsByNumeroDocumento(datos.numeroDocumento())) {
            throw new RuntimeException("Número de documento duplicado");
        }
        empleadoRepository.save(new Empleado(datos));
    }

    public Page<DatosListadoEmpleado> listarEmpleados(Pageable paginacion) {
        return empleadoRepository.findAll(paginacion).map(DatosListadoEmpleado::new);
    }
}

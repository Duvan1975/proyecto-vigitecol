package proyectoVigitecolSpringBoot.empleado;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EmpleadoService {

    @Autowired EmpleadoRepository empleadoRepository;

    public void registrarEmpleado(DatosRegistroEmpleado datos) {
        empleadoRepository.save(new Empleado(datos));
    }
}

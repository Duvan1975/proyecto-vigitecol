package proyectoVigitecolSpringBoot.empleado;

import org.springframework.beans.factory.annotation.Autowired;
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

    public List<DatosListadoEmpleado> listarEmpleados() {
        return empleadoRepository.findAll().stream().map(DatosListadoEmpleado::new).toList();
    }

}

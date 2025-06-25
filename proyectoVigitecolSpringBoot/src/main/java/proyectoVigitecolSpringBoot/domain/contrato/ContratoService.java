package proyectoVigitecolSpringBoot.domain.contrato;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;

@Service
public class ContratoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    public void registrarContrato(Long empleadoId, DatosRegistroContrato datos) {
        var empleado = empleadoRepository.findById(empleadoId)
            .orElseThrow(() -> new RuntimeException("Persona NO encontrada"));
        var contrato = new Contrato(datos, empleado);
        contratoRepository.save(contrato);
    }
    public List<Contrato> listarContratos() {
        return contratoRepository.findAll();
    }
    public List<DatosListadoContrato> obtenerContratosPorEmpleado(Long empleadoId) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado o está inactiva"));
        return empleado.getContratos()
                .stream()
                .map(DatosListadoContrato::new)
                .toList();
    }
}

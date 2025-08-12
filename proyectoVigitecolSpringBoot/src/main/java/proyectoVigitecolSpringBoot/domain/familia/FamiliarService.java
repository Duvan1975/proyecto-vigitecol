package proyectoVigitecolSpringBoot.domain.familia;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoRepository;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;

@Service
public class FamiliarService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private FamiliarRepository familiarRepository;

    @Autowired
    private ContratoRepository contratoRepository;

    public void registrarFamiliar(Long empleadoId, List<DatosRegistroFamiliar> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<Familiar> familiares = listaDatos.stream()
                .map(datos -> new Familiar(datos, empleado))
                .toList();
        familiarRepository.saveAll(familiares);
    }

    public Page<Familiar> listarFamiliares(Pageable paginacion) {
        return familiarRepository.findAll(paginacion);
    }

    public List<DatosListadoFamiliar> obtenerFamiliaresPorEmpleadoActivo(Long empleadoId) {
        var familiares = familiarRepository.findFamiliaresByEmpleadoActivo(empleadoId);

        if (familiares.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin familiares registrados");
        }

        return familiares.stream()
                .map(DatosListadoFamiliar::new)
                .toList();
    }

}

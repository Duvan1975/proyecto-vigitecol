package proyectoVigitecolSpringBoot.domain.familia;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.contrato.ContratoRepository;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;
import java.util.Optional;

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
    @Transactional
    public DatosRespuestaFamiliar actualizarFamiliar(DatosActualizarFamiliar datos) {
        Optional<Familiar> optionalFamiliar = familiarRepository.findById(datos.id());

        if (optionalFamiliar.isEmpty()) {
            throw new EntityNotFoundException("Familiar no encontrado con ID: " + datos.id());
        }

        Familiar familiar = optionalFamiliar.get();
        familiar.actualizarDatos(datos);

        return new DatosRespuestaFamiliar(
                familiar.getFamiliarId(),
                familiar.getTipoFamiliar(),
                familiar.getNombreFamiliar(),
                familiar.getEdadFamiliar()
        );
    }

    public void eliminarFamiliar(Long id) {
        if (!familiarRepository.existsById(id)) {
            throw new EntityNotFoundException("Famililar no encontrado con ID: " + id);
        }
        familiarRepository.deleteById(id); // Devuelve 204 No Content
    }
}

package proyectoVigitecolSpringBoot.domain.otroDocumento;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import proyectoVigitecolSpringBoot.domain.empleado.EmpleadoRepository;

import java.util.List;
import java.util.Optional;

@Service
public class OtroDocumentoService {

    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Autowired
    private OtroDocumentoRepository otroDocumentoRepository;

    public void registrarOtroDocumento(Long empleadoId, List<DatosRegistroOtroDocumento> listaDatos) {
        var empleado = empleadoRepository.findById(empleadoId)
                .orElseThrow(() -> new RuntimeException("Empleado NO encontrado"));
        List<OtroDocumento> documentos = listaDatos.stream()
                .map(datos -> new OtroDocumento(datos, empleado))
                .toList();
        otroDocumentoRepository.saveAll(documentos);
    }

    public Page<OtroDocumento> listarDocumentos(Pageable paginacion) {
        return otroDocumentoRepository.findAll(paginacion);
    }

    public List<DatosListadoOtroDocumento> obtenerDocumentosPorEmpleadoActivo(Long empleadoId) {
        var documentos = otroDocumentoRepository.findDocumentosByEmpleadoActivo(empleadoId);

        if (documentos.isEmpty()) {
            throw new RuntimeException("Empleado no encontrado, sin contrato activo o sin documentos registrados");
        }
        return documentos.stream()
                .map(DatosListadoOtroDocumento::new)
                .toList();
    }

    @Transactional
    public DatosRespuestaDocumento actualizarDocumento(DatosActualizarDocumento datos) {
        Optional<OtroDocumento> optionalOtroDocumento = otroDocumentoRepository.findById(datos.id());

        if (optionalOtroDocumento.isEmpty()) {
            throw new EntityNotFoundException("Documento no encontrado con ID: " + datos.id());
        }
        OtroDocumento documento = optionalOtroDocumento.get();
        documento.actualizarDatos(datos);

        return new DatosRespuestaDocumento(
                documento.getDocumentoId(),
                documento.getTipoDocumento(),
                documento.getDescripcionDocumento(),
                documento.getFechaRegistro()
        );
    }

    public void eliminarDocumento(Long id) {
        if (!otroDocumentoRepository.existsById(id)) {
            throw new EntityNotFoundException("Documento no encontrado con ID: " + id);
        }
        otroDocumentoRepository.deleteById(id); // Devuelve 204 No Content
    }
}

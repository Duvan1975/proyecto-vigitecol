package proyectoVigitecolSpringBoot.domain.historial;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HistorialService {

    private final HistorialRepository historialRepository;

    public HistorialService(HistorialRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    public List<HistorialAccion> listarHistorial() {
        return historialRepository.findAll();
    }

    public void guardarAccion(String usuario, String accion, String descripcion) {
        historialRepository.save(new HistorialAccion(usuario, accion, descripcion));
    }
}

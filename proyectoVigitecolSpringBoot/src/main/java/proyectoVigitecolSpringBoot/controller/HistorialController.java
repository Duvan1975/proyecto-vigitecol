package proyectoVigitecolSpringBoot.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;

@RestController
@RequestMapping("/historial")
@CrossOrigin(origins = "http://localhost:3000")
public class HistorialController {


    private final HistorialRepository historialRepository;

    public HistorialController(HistorialRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    @GetMapping
    public Page<HistorialAccion> listarHistorial(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return historialRepository.findAll(PageRequest.of(page, size));
    }
}

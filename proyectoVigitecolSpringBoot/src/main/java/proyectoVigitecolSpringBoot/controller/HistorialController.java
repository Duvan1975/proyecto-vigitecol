package proyectoVigitecolSpringBoot.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import proyectoVigitecolSpringBoot.domain.historial.HistorialAccion;
import proyectoVigitecolSpringBoot.domain.historial.HistorialRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/historial")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://proyecto-vigitecol-dsa7.vercel.app"
})
public class HistorialController {

    private final HistorialRepository historialRepository;

    public HistorialController(HistorialRepository historialRepository) {
        this.historialRepository = historialRepository;
    }

    // 🔹 Paginado normal
    @GetMapping
    public Page<HistorialAccion> listarHistorial(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return historialRepository.findAll(PageRequest.of(page, size, Sort.by("fecha").descending()));
    }

    // 🔹 Todos los registros sin filtro
    @GetMapping("/todo")
    public List<HistorialAccion> obtenerTodo() {
        return historialRepository.findAll(Sort.by(Sort.Direction.DESC, "fecha"));
    }

    // 🔹 Filtrar por rango de fechas (paginado)
    @GetMapping("/filtrar")
    public Page<HistorialAccion> filtrar(
            @RequestParam String desde,
            @RequestParam String hasta,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        LocalDateTime fechaDesde = LocalDateTime.parse(desde);
        LocalDateTime fechaHasta = LocalDateTime.parse(hasta);

        return historialRepository.findByFechaBetween(
                        fechaDesde,
                        fechaHasta,
                        Sort.by("fecha").descending()
                ).stream()
                .skip(page * size)
                .limit(size)
                .collect(Collectors.collectingAndThen(Collectors.toList(), lista ->
                        new PageImpl<>(lista, PageRequest.of(page, size), lista.size())
                ));
    }

    // 🔹 Filtrar todo sin paginar → para Excel
    @GetMapping("/filtrar/todo")
    public List<HistorialAccion> filtrarTodo(
            @RequestParam String desde,
            @RequestParam String hasta
    ) {
        LocalDateTime fechaDesde = LocalDateTime.parse(desde);
        LocalDateTime fechaHasta = LocalDateTime.parse(hasta);

        return historialRepository.findByFechaBetween(
                fechaDesde,
                fechaHasta,
                Sort.by(Sort.Direction.DESC, "fecha")
        );
    }
}
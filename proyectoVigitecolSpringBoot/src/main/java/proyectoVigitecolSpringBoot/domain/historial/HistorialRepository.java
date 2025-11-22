package proyectoVigitecolSpringBoot.domain.historial;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface HistorialRepository extends JpaRepository<HistorialAccion, Long> {

    List<HistorialAccion> findByFechaBetween(LocalDateTime desde, LocalDateTime hasta, Sort sort);
}

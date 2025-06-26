package proyectoVigitecolSpringBoot.domain.contrato;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.util.Optional;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    Optional<Contrato> findTopByEmpleadoIdAndContinuaTrueOrderByFechaIngresoDesc(Long empleadoId);

    @Query("SELECT c.empleado FROM Contrato c WHERE c.continua = true")
    Page<Empleado> findEmpleadosConContratoActivo(Pageable pageable);

}

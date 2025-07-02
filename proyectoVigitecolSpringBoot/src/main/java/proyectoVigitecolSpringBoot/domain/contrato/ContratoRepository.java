package proyectoVigitecolSpringBoot.domain.contrato;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.util.Optional;

public interface ContratoRepository extends JpaRepository<Contrato, Long> {
    Optional<Contrato> findTopByEmpleadoIdAndContinuaTrueOrderByFechaIngresoDesc(Long empleadoId);

    Optional<Contrato> findTopByEmpleadoIdAndContinuaFalseOrderByFechaIngresoDesc(Long empleadoId);

    @Query("""
    SELECT c.empleado
    FROM Contrato c
    WHERE c.numeroContrato = (
        SELECT MAX(c2.numeroContrato)
        FROM Contrato c2
        WHERE c2.empleado.id = c.empleado.id
    )
    AND c.continua = true
    """)
    Page<Empleado> findEmpleadosConContratoActivo(Pageable pageable);

    @Query("""
    SELECT c.empleado
    FROM Contrato c
    WHERE c.numeroContrato = (
        SELECT MAX(c2.numeroContrato)
        FROM Contrato c2
        WHERE c2.empleado.id = c.empleado.id
    )
    AND c.continua = false
    """)
    Page<Empleado> findEmpleadosConContratoInactivo(Pageable pageable);

    @Query("SELECT MAX(c.numeroContrato) FROM Contrato c WHERE c.empleado.id = :empleadoId")
    Integer obtenerUltimoNumeroContratoPorEmpleado(@Param("empleadoId") Long empleadoId);

}

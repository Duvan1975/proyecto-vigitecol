package proyectoVigitecolSpringBoot.domain.contrato;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.util.List;
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
    AND c.continua = true ORDER BY c.empleado.apellidos ASC
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
    ORDER BY c.empleado.apellidos ASC
    """)
    Page<Empleado> findEmpleadosConContratoInactivo(Pageable pageable);

    @Query("SELECT MAX(c.numeroContrato) " +
            "FROM Contrato c " +
            "WHERE c.empleado.id = :empleadoId")
    Integer obtenerUltimoNumeroContratoPorEmpleado(@Param("empleadoId") Long empleadoId);

    @Query("SELECT c.empleado FROM Contrato c WHERE c.empleado.id = :empleadoId AND c.continua = false ORDER BY c.fechaIngreso DESC")
    Optional<Empleado> findEmpleadoInactivoPorId(@Param("empleadoId") Long empleadoId);

    @Query("SELECT c.empleado FROM Contrato c " +
            "WHERE c.empleado.id = :empleadoId " +
            "AND c.continua = true " +
            "ORDER BY c.fechaIngreso DESC")
    Optional<Empleado> findEmpleadoActivoPorId(@Param("empleadoId") Long empleadoId);

    @Query("SELECT c.empleado FROM Contrato c " +
            "WHERE c.continua = true " +
            "ORDER BY c.fechaIngreso DESC")
    List<Empleado> buscarTodosEmpleadosActivos();

    @Query("SELECT c.empleado FROM Contrato c " +
            "WHERE c.empleado.numeroDocumento = :numeroDocumento " +
            "AND c.continua = true " +
            "ORDER BY c.fechaIngreso DESC")
    List<Empleado> buscarEmpleadoActivoPorNumeroDocumento(@Param("numeroDocumento") String numeroDocumento);

    @Query("SELECT c.empleado FROM Contrato c " +
            "WHERE c.continua = false " +
            "ORDER BY c.fechaIngreso DESC")
    List<Empleado> buscarTodosEmpleadosInactivos();

    @Query("SELECT c.empleado FROM Contrato c " +
            "WHERE c.empleado.numeroDocumento = :numeroDocumento " +
            "AND c.continua = false " +
            "ORDER BY c.fechaIngreso DESC")
    List<Empleado> buscarEmpleadoInactivoPorNumeroDocumento(@Param("numeroDocumento") String numeroDocumento);
}

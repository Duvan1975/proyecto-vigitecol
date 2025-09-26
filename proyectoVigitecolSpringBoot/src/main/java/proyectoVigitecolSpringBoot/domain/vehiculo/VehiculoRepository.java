package proyectoVigitecolSpringBoot.domain.vehiculo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehiculoRepository extends JpaRepository<Vehiculo, Long> {

    @Query("""
            SELECT v FROM Vehiculo v
            JOIN v.empleado e
            JOIN e.contratos c
            WHERE e.id = :empleadoId
            AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado.id = e.id
            )
            AND c.continua = true
            """)
    List<Vehiculo> findVehiculoByEmpleadoActivo(Long empleadoId);

    List<Vehiculo> findByEmpleadoId(Long id);
}

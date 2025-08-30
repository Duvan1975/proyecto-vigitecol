package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface EmpleadoRepository extends JpaRepository<Empleado, Long> {
    boolean existsByCorreo(@Email(
            message = "Debe ser un correo electrónico válido") String correo);

    boolean existsByNumeroDocumento(@NotBlank @Pattern(
            regexp = "\\d{7,15}", message = "Debe contener solo números entre 7 y 15 digitos") String s);

    @Query("""
                SELECT e
                FROM Empleado e
                WHERE e.id NOT IN (
                    SELECT DISTINCT c.empleado.id
                    FROM Contrato c
                )
                ORDER BY e.apellidos ASC
            """)
    Page<Empleado> findEmpleadosSinContrato(Pageable pageable);

    @Query("""
                SELECT e FROM Empleado e
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato) 
                    FROM Contrato c2 
                    WHERE c2.empleado = e
                ) AND c.continua = true
                  AND (:tipoEmpleado IS NULL OR c.empleado.tipoEmpleado = :tipoEmpleado)
                WHERE SIZE(e.familiares) > 0
            """)
    Page<Empleado> findEmpleadosConFamiliares(
            @Param("tipoEmpleado") TipoEmpleado tipoEmpleado,
            Pageable pageable);

    @Query("""
                SELECT DISTINCT e FROM Empleado e
                JOIN e.familiares f
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato) 
                    FROM Contrato c2 
                    WHERE c2.empleado = e
                ) AND c.continua = true
                  AND (:tipoEmpleado IS NULL OR c.empleado.tipoEmpleado = :tipoEmpleado)
                WHERE f.edadFamiliar <= 12
            """)
    Page<Empleado> findEmpleadosConFamiliaresMenoresDe12(
            @Param("tipoEmpleado") TipoEmpleado tipoEmpleado,
            Pageable pageable);

    @Query("""
                SELECT e FROM Empleado e
                JOIN FETCH e.familiares f
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato) 
                    FROM Contrato c2 
                    WHERE c2.empleado = e
                ) AND c.continua = true
                WHERE (:tipoEmpleado IS NULL OR e.tipoEmpleado = :tipoEmpleado)
                AND SIZE(e.familiares) > 0
            """)
    Page<Empleado> findConTodosLosFamiliares(
            @Param("tipoEmpleado") TipoEmpleado tipoEmpleado,
            Pageable pageable);

    @Query("""
                SELECT e FROM Empleado e
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato)
                    FROM Contrato c2
                    WHERE c2.empleado = e
                )AND c.continua = true
                WHERE SIZE(e.cursos) > 0
            """)
    Page<Empleado> findEmpleadosConCurso(Pageable pageable);

    @Query("""
            SELECT e FROM Empleado e
            JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                SELECT MAX(c2.numeroContrato)
                FROM Contrato c2
                WHERE c2.empleado = e
            )
            WHERE c.continua = true
            AND EXISTS (
                SELECT 1 
                FROM Curso cu
                WHERE cu.empleado = e
                AND cu.cursoId = (
                    SELECT MAX(c2.cursoId)
                    FROM Curso c2
                    WHERE c2.empleado = e
                )
                AND (
                    (cu.fechaCurso + 1 YEAR BETWEEN :hoy AND :fechaLimite)
                    OR (cu.fechaCurso + 1 YEAR BETWEEN :hace30Dias AND :ayer)
                )
            )
            """)
    Page<Empleado> findEmpleadosConCursosPorVencer(
            @Param("hoy") LocalDate hoy,
            @Param("fechaLimite") LocalDate fechaLimite,
            @Param("hace30Dias") LocalDate hace30Dias,
            @Param("ayer") LocalDate ayer,
            Pageable pageable
    );

    @Query("""
            SELECT e FROM Empleado e
            JOIN Contrato c ON c.empleado = e
            WHERE c.numeroContrato = 1
            AND c.continua = true
            AND c.fechaIngreso BETWEEN :fechaMin AND :fechaMax
            """)
    Page<Empleado> findEmpleadosEnPeriodoDePruebaVencido(
            @Param("fechaMin") LocalDate fechaMin,
            @Param("fechaMax") LocalDate fechaMax,
            Pageable pageable);

    @Query("""
                SELECT e FROM Empleado e
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato)
                    FROM Contrato c2
                    WHERE c2.empleado = e
                )AND c.continua = true
                WHERE SIZE(e.estudios) > 0
            """)
    Page<Empleado> findEmpleadosConEstudios(Pageable pageable);

    @Query("""
                SELECT e FROM Empleado e
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato)
                    FROM Contrato c2
                    WHERE c2.empleado = e
                )AND c.continua = true
                WHERE SIZE(e.experienciaLaboral) > 0
            """)
    Page<Empleado> findEmpleadosConExperienciasLaborales(Pageable pageable);

    @Query("""
                SELECT e FROM Empleado e
                JOIN Contrato c ON c.empleado = e AND c.numeroContrato = (
                    SELECT MAX(c2.numeroContrato)
                    FROM Contrato c2
                    WHERE c2.empleado = e
                )AND c.continua = true
                WHERE SIZE(e.afiliaciones) > 0
            """)
    Page<Empleado> findEmpleadosConAfiliaciones(Pageable pageable);
}
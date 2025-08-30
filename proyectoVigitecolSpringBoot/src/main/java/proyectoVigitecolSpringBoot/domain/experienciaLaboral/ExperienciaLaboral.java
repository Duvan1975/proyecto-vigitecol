package proyectoVigitecolSpringBoot.domain.experienciaLaboral;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

@Entity
@Table(name = "experienciaLaboral")
public class ExperienciaLaboral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long experienciaLaboralId;

    private String descripcionExperiencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public ExperienciaLaboral(DatosRegistroExperienciaLaboral datos, Empleado empleado) {
        this.descripcionExperiencia = datos.descripcionExperiencia();
        this.empleado = empleado;
    }
    public ExperienciaLaboral() {}

    public Long getExperienciaLaboralId() {
        return experienciaLaboralId;
    }

    public void setExperienciaLaboralId(Long experienciaLaboralId) {
        this.experienciaLaboralId = experienciaLaboralId;
    }

    public String getDescripcionExperiencia() {
        return descripcionExperiencia;
    }

    public void setDescripcionExperiencia(String descripcionExperiencia) {
        this.descripcionExperiencia = descripcionExperiencia;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public void actualizarDatos(DatosActualizarExperienciaLaboral datos) {
        if (datos.descripcionExperiencia() != null) {
            this.descripcionExperiencia = datos.descripcionExperiencia();
        }
    }
}

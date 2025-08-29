package proyectoVigitecolSpringBoot.domain.estudio;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.time.LocalDate;

@Entity
@Table(name = "estudio")
public class Estudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long estudioId;

    @Enumerated(EnumType.STRING)
    private TipoEstudio tipoEstudio;

    private String nombreEstudio;

    private LocalDate fechaEstudio;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public Estudio(DatosRegistroEstudio datos, Empleado empleado) {
        this.tipoEstudio = datos.tipoEstudio();
        this.nombreEstudio = datos.nombreEstudio();
        this.fechaEstudio = datos.fechaEstudio();
        this.empleado = empleado;
    }
    //Constructor vacío
    public Estudio (){}

    public Long getEstudioId() {
        return estudioId;
    }

    public void setEstudioId(Long estudioId) {
        this.estudioId = estudioId;
    }

    public TipoEstudio getTipoEstudio() {
        return tipoEstudio;
    }

    public void setTipoEstudio(TipoEstudio tipoEstudio) {
        this.tipoEstudio = tipoEstudio;
    }

    public String getNombreEstudio() {
        return nombreEstudio;
    }

    public void setNombreEstudio(String nombreEstudio) {
        this.nombreEstudio = nombreEstudio;
    }

    public LocalDate getFechaEstudio() {
        return fechaEstudio;
    }

    public void setFechaEstudio(LocalDate fechaEstudio) {
        this.fechaEstudio = fechaEstudio;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public void actualizarDatos(DatosActualizarEstudio datos) {
        if (datos.tipoEstudio() != null) {
            this.tipoEstudio = datos.tipoEstudio();
        }
        if (datos.nombreEstudio() != null) {
            this.nombreEstudio = datos.nombreEstudio();
        }
        if (datos.fechaEstudio() != null) {
            this.fechaEstudio = datos.fechaEstudio();
        }
    }
}

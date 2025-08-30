package proyectoVigitecolSpringBoot.domain.afiliacion;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.time.LocalDate;

@Entity
@Table(name = "afiliacion")
public class Afiliacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long afiliacionId;

    @Enumerated(EnumType.STRING)
    private TipoAfiliacion tipoAfiliacion;

    private String nombreEntidad;

    private LocalDate fechaAfiliacion;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public Afiliacion(DatosRegistroAfiliacion datos, Empleado empleado) {
        this.tipoAfiliacion = datos.tipoAfiliacion();
        this.nombreEntidad = datos.nombreEntidad();
        this.fechaAfiliacion = datos.fechaAfiliacion();
        this.empleado = empleado;
    }

    public Long getAfiliacionId() {
        return afiliacionId;
    }

    public void setAfiliacionId(Long afiliacionId) {
        this.afiliacionId = afiliacionId;
    }

    public TipoAfiliacion getTipoAfiliacion() {
        return tipoAfiliacion;
    }

    public void setTipoAfiliacion(TipoAfiliacion tipoAfiliacion) {
        this.tipoAfiliacion = tipoAfiliacion;
    }

    public String getNombreEntidad() {
        return nombreEntidad;
    }

    public void setNombreEntidad(String nombreEntidad) {
        this.nombreEntidad = nombreEntidad;
    }

    public LocalDate getFechaAfiliacion() {
        return fechaAfiliacion;
    }

    public void setFechaAfiliacion(LocalDate fechaAfiliacion) {
        this.fechaAfiliacion = fechaAfiliacion;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Afiliacion(){}
}

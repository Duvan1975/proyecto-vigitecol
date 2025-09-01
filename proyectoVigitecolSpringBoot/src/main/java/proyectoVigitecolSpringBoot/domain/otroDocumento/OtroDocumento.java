package proyectoVigitecolSpringBoot.domain.otroDocumento;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.time.LocalDate;

@Entity
@Table(name = "otroDocumento")
public class OtroDocumento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long documentoId;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    private String descripcionDocumento;

    private LocalDate fechaRegistro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public OtroDocumento(DatosRegistroOtroDocumento datos, Empleado empleado) {
        this.tipoDocumento = datos.tipoDocumento();
        this.descripcionDocumento = datos.descripcionDocumento();
        this.fechaRegistro = datos.fechaRegistro();
        this.empleado = empleado;
    }

    public OtroDocumento() {}

    public Long getDocumentoId() {
        return documentoId;
    }

    public void setDocumentoId(Long documentoId) {
        this.documentoId = documentoId;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getDescripcionDocumento() {
        return descripcionDocumento;
    }

    public void setDescripcionDocumento(String descripcionDocumento) {
        this.descripcionDocumento = descripcionDocumento;
    }

    public LocalDate getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDate fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public void actualizarDatos(DatosActualizarDocumento datos) {
        if (datos.tipoDocumento() != null) {
            this.tipoDocumento = datos.tipoDocumento();
        }
        if (datos.descripcionDocumento() != null) {
            this.descripcionDocumento = datos.descripcionDocumento();
        }
        if (datos.fechaRegistro() != null) {
            this.fechaRegistro = datos.fechaRegistro();
        }
    }
}

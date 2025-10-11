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
    private TipoOtroDocumento tipoOtroDocumento;

    private String descripcionDocumento;

    private LocalDate fechaRegistro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public OtroDocumento(DatosRegistroOtroDocumento datos, Empleado empleado) {
        this.tipoOtroDocumento = datos.tipoOtroDocumento();
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

    public TipoOtroDocumento getTipoOtroDocumento() {
        return tipoOtroDocumento;
    }

    public void setTipoOtroDocumento(TipoOtroDocumento tipoOtroDocumento) {
        this.tipoOtroDocumento = tipoOtroDocumento;
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
        if (datos.tipoOtroDocumento() != null) {
            this.tipoOtroDocumento = datos.tipoOtroDocumento();
        }
        if (datos.descripcionDocumento() != null) {
            this.descripcionDocumento = datos.descripcionDocumento();
        }
        if (datos.fechaRegistro() != null) {
            this.fechaRegistro = datos.fechaRegistro();
        }
    }
}

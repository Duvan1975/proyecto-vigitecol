package proyectoVigitecolSpringBoot.domain.contrato;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.time.LocalDate;

@Entity
@Table(name = "contrato")
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long contratoId;

    private int numeroContrato;
    private LocalDate fechaIngreso;
    private LocalDate fechaRetiro;
    private LocalDate fechaRenuncia;
    private LocalDate fechaOtroSi;
    private String omiso;
    private Boolean continua;
    private LocalDate vacacionesDesde;
    private LocalDate vacacionesHasta;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")

    private Empleado empleado;

    //Constructor vacío
    public Contrato() {
        this.continua = true;
    }

    public Contrato(DatosRegistroContrato datos, Empleado empleado) {
        this.numeroContrato = datos.numeroContrato();
        this.fechaIngreso = datos.fechaIngreso();
        this.fechaRetiro = datos.fechaRetiro();
        this.fechaRenuncia = datos.fechaRenuncia();
        this.fechaOtroSi = datos.fechaOtroSi();
        this.omiso = datos.omiso();
        this.continua = true;
        this.vacacionesDesde = datos.vacacionesDesde();
        this.vacacionesHasta = datos.vacacionesHasta();
        this.empleado = empleado;
    }

    public void actualizarDatos(DatosActualizarContrato datos) {

        if (datos.fechaIngreso() != null) {
            this.fechaIngreso = datos.fechaIngreso();
        }
        if (datos.fechaRetiro() != null) {
            this.fechaRetiro = datos.fechaRetiro();
        }
        if (datos.fechaRenuncia() != null) {
            this.fechaRenuncia = datos.fechaRenuncia();
        }
        if (datos.fechaOtroSi() != null) {
            this.fechaOtroSi = datos.fechaOtroSi();
        }
        if (datos.omiso() != null) {
            this.omiso = datos.omiso();
        }
        if (this.continua != datos.continua()) {
            this.continua = datos.continua();
        }
        if (datos.vacacionesDesde() != null) {
            this.vacacionesDesde = datos.vacacionesDesde();
        }
        if (datos.vacacionesHasta() != null) {
            this.vacacionesHasta = datos.vacacionesHasta();
        }
    }
    //Getters and Setters

    public Long getContratoId() {
        return contratoId;
    }

    public void setContratoId(Long contratoId) {
        this.contratoId = contratoId;
    }

    public int getNumeroContrato() {
        return numeroContrato;
    }

    public void setNumeroContrato(int numeroContrato) {
        this.numeroContrato = numeroContrato;
    }

    public LocalDate getFechaIngreso() {
        return fechaIngreso;
    }

    public void setFechaIngreso(LocalDate fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public LocalDate getFechaRetiro() {
        return fechaRetiro;
    }

    public void setFechaRetiro(LocalDate fechaRetiro) {
        this.fechaRetiro = fechaRetiro;
    }

    public LocalDate getFechaRenuncia() {
        return fechaRenuncia;
    }

    public void setFechaRenuncia(LocalDate fechaRenuncia) {
        this.fechaRenuncia = fechaRenuncia;
    }

    public LocalDate getFechaOtroSi() {
        return fechaOtroSi;
    }

    public void setFechaOtroSi(LocalDate fechaOtroSi) {
        this.fechaOtroSi = fechaOtroSi;
    }

    public String getOmiso() {
        return omiso;
    }

    public void setOmiso(String omiso) {
        this.omiso = omiso;
    }

    public Boolean getContinua() {
        return continua;
    }

    public void setContinua(Boolean continua) {
        this.continua = continua;
    }

    public LocalDate getVacacionesDesde() {
        return vacacionesDesde;
    }

    public void setVacacionesDesde(LocalDate vacacionesDesde) {
        this.vacacionesDesde = vacacionesDesde;
    }

    public LocalDate getVacacionesHasta() {
        return vacacionesHasta;
    }

    public void setVacacionesHasta(LocalDate vacacionesHasta) {
        this.vacacionesHasta = vacacionesHasta;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
}

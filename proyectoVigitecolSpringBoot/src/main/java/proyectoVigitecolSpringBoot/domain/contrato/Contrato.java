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

    @ManyToOne
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

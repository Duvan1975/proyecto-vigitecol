package proyectoVigitecolSpringBoot.domain.vehiculo;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.time.LocalDate;

@Entity
@Table(name = "vehiculo")
public class Vehiculo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vehiculoId;

    @Enumerated(EnumType.STRING)
    private TipoVehiculo tipoVehiculo;

    private LocalDate tecnomecanico;
    private LocalDate soat;
    private LocalDate licencia;
    private String placa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public Vehiculo(DatosRegistroVehiculo datos, Empleado empleado) {
        this.tipoVehiculo = datos.tipoVehiculo();
        this.tecnomecanico = datos.tecnomecanico();
        this.soat = datos.soat();
        this.licencia = datos.licencia();
        this.placa = datos.placa();
        this.empleado = empleado;
    }

    public Vehiculo() {}

    public Long getVehiculoId() {
        return vehiculoId;
    }

    public void setVehiculoId(Long vehiculoId) {
        this.vehiculoId = vehiculoId;
    }

    public TipoVehiculo getTipoVehiculo() {
        return tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public LocalDate getTecnomecanico() {
        return tecnomecanico;
    }

    public void setTecnomecanico(LocalDate tecnomecanico) {
        this.tecnomecanico = tecnomecanico;
    }

    public LocalDate getSoat() {
        return soat;
    }

    public void setSoat(LocalDate soat) {
        this.soat = soat;
    }

    public LocalDate getLicencia() {
        return licencia;
    }

    public void setLicencia(LocalDate licencia) {
        this.licencia = licencia;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public void actualizarDatos(DatosActualizarVehiculo datos) {
        if (datos.tipoVehiculo() != null) {
            this.tipoVehiculo = datos.tipoVehiculo();
        }
        if (datos.tecnomecanico() != null) {
            this.tecnomecanico = datos.tecnomecanico();
        }
        if (datos.soat() != null) {
            this.soat = datos.soat();
        }
        if (datos.licencia() != null) {
            this.licencia = datos.licencia();
        }
        if (datos.placa() != null) {
            this.placa = datos.placa();
        }
    }
}

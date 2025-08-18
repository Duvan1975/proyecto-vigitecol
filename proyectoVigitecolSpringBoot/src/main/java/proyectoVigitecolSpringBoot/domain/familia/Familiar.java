package proyectoVigitecolSpringBoot.domain.familia;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

@Entity
@Table(name = "familiar")
public class Familiar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long familiarId;

    @Enumerated(EnumType.STRING)
    private TipoFamiliar tipoFamiliar;

    private String nombreFamiliar;
    private int edadFamiliar;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public Familiar(DatosRegistroFamiliar datos, Empleado empleado) {
        this.tipoFamiliar = datos.tipoFamiliar();
        this.nombreFamiliar = datos.nombreFamiliar();
        this.edadFamiliar = datos.edadFamiliar();
        this.empleado = empleado;
    }
    //Constructor vacío
    public Familiar() {}

    public Long getFamiliarId() {
        return familiarId;
    }

    public void setFamiliarId(Long familiarId) {
        this.familiarId = familiarId;
    }

    public TipoFamiliar getTipoFamiliar() {
        return tipoFamiliar;
    }

    public void setTipoFamiliar(TipoFamiliar tipoFamiliar) {
        this.tipoFamiliar = tipoFamiliar;
    }

    public String getNombreFamiliar() {
        return nombreFamiliar;
    }

    public void setNombreFamiliar(String nombreFamiliar) {
        this.nombreFamiliar = nombreFamiliar;
    }

    public int getEdadFamiliar() {
        return edadFamiliar;
    }

    public void setEdadFamiliar(int edadFamiliar) {
        this.edadFamiliar = edadFamiliar;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public void actualizarDatos(DatosActualizarFamiliar datos){
        if (datos.tipoFamiliar() != null){
            this.tipoFamiliar = datos.tipoFamiliar();
        }
        if (datos.nombreFamiliar() != null && !datos.nombreFamiliar().isBlank()) {
            this.nombreFamiliar = datos.nombreFamiliar();
        }
        if (datos.edadFamiliar() >= 0)
            this.edadFamiliar = datos.edadFamiliar();
    }
}

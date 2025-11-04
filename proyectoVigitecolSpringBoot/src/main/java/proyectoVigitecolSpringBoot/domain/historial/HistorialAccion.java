package proyectoVigitecolSpringBoot.domain.historial;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_acciones")
@Data
@AllArgsConstructor
public class HistorialAccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String usuario;      // quien hizo la acción
    private String accion;       // tipo de acción
    private String descripcion;  // detalle de lo que hizo
    private LocalDateTime fecha = LocalDateTime.now();

    public HistorialAccion(String usuario, String accion, String descripcion) {
        this.usuario = usuario;
        this.accion = accion;
        this.descripcion = descripcion;
        this.fecha = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public HistorialAccion () {}
}
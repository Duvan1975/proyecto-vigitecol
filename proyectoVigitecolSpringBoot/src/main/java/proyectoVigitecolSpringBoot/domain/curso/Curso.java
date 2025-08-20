package proyectoVigitecolSpringBoot.domain.curso;

import jakarta.persistence.*;
import proyectoVigitecolSpringBoot.domain.empleado.Empleado;

import java.time.LocalDate;

@Entity
@Table(name = "curso")
public class Curso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cursoId;

    @Enumerated(EnumType.STRING)
    private TipoCurso tipoCurso;

    @Enumerated(EnumType.STRING)
    private Categoria categoria;

    private LocalDate fechaCurso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "empleado_id")
    private Empleado empleado;

    public Curso(DatosRegistroCurso datos, Empleado empleado) {
        this.tipoCurso = datos.tipoCurso();
        this.categoria = datos.categoria();
        this.fechaCurso = datos.fechaCurso();
        this.empleado = empleado;
    }

    public Long getCursoId() {
        return cursoId;
    }

    public void setCursoId(Long cursoId) {
        this.cursoId = cursoId;
    }

    public TipoCurso getTipoCurso() {
        return tipoCurso;
    }

    public void setTipoCurso(TipoCurso tipoCurso) {
        this.tipoCurso = tipoCurso;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public LocalDate getFechaCurso() {
        return fechaCurso;
    }

    public void setFechaCurso(LocalDate fechaCurso) {
        this.fechaCurso = fechaCurso;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }
    //Constructor vacío
    public Curso() {}
}

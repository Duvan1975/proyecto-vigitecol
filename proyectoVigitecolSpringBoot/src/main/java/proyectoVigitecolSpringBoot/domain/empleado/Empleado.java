package proyectoVigitecolSpringBoot.domain.empleado;

import jakarta.persistence.*;
import lombok.*;
import proyectoVigitecolSpringBoot.domain.contrato.Contrato;
import proyectoVigitecolSpringBoot.domain.curso.Curso;
import proyectoVigitecolSpringBoot.domain.estudio.Estudio;
import proyectoVigitecolSpringBoot.domain.familia.Familiar;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Table(name = "empleado")
@Entity(name = "Empleado")
@Getter
@Setter
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Empleado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombres;
    private String apellidos;

    @Enumerated(EnumType.STRING)
    private TipoDocumento tipoDocumento;

    private String numeroDocumento;
    private LocalDate fechaNacimiento;
    private String lugarNacimiento;
    private String ciudadExpedicion;
    private int edad;

    @Enumerated(EnumType.STRING)
    private LibretaMilitar libretaMilitar;

    @Enumerated(EnumType.STRING)
    private EstadoCivil estadoCivil;

    @Enumerated(EnumType.STRING)
    private Genero genero;

    private String direccion;
    private String telefono;
    private String correo;

    @Enumerated(EnumType.STRING)
    private TipoEmpleado tipoEmpleado;

    private String cargo;

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Contrato> contratos = new ArrayList<>();

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Familiar> familiares = new ArrayList<>();

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Curso> cursos = new ArrayList<>();

    @OneToMany(mappedBy = "empleado", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Estudio> estudios = new ArrayList<>();

    //Constructor para registrar empleado
    public Empleado(DatosRegistroEmpleado datos) {
        this.nombres = datos.nombres().trim(); //.trim() elimina espacios extra
        this.apellidos = datos.apellidos().trim();
        this.tipoDocumento = datos.tipoDocumento();
        this.numeroDocumento = datos.numeroDocumento();
        this.fechaNacimiento = datos.fechaNacimiento();
        this.lugarNacimiento = datos.lugarNacimiento();
        this.ciudadExpedicion = datos.ciudadExpedicion();
        this.edad = Period.between(this.fechaNacimiento, LocalDate.now()).getYears();
        this.libretaMilitar = datos.libretaMilitar();
        this.estadoCivil = datos.estadoCivil();
        this.genero = datos.genero();
        this.direccion = datos.direccion();
        this.telefono = datos.telefono();
        this.correo = datos.correo();
        this.tipoEmpleado = datos.tipoEmpleado();
        this.cargo = datos.cargo();
    }
    //Constructor vacío
    public Empleado() {

    }
    //Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public TipoDocumento getTipoDocumento() {
        return tipoDocumento;
    }

    public void setTipoDocumento(TipoDocumento tipoDocumento) {
        this.tipoDocumento = tipoDocumento;
    }

    public String getNumeroDocumento() {
        return numeroDocumento;
    }

    public void setNumeroDocumento(String numeroDocumento) {
        this.numeroDocumento = numeroDocumento;
    }

    public LocalDate getFechaNacimiento() {
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento) {
        this.fechaNacimiento = fechaNacimiento;
    }

    public String getLugarNacimiento() {
        return lugarNacimiento;
    }

    public void setLugarNacimiento(String lugarNacimiento) {
        this.lugarNacimiento = lugarNacimiento;
    }

    public String getCiudadExpedicion() {
        return ciudadExpedicion;
    }

    public void setCiudadExpedicion(String ciudadExpedicion) {
        this.ciudadExpedicion = ciudadExpedicion;
    }

    public int getEdad() {
        return edad;
    }

    public void setEdad(int edad) {
        this.edad = edad;
    }

    public LibretaMilitar getLibretaMilitar() {
        return libretaMilitar;
    }

    public void setLibretaMilitar(LibretaMilitar libretaMilitar) {
        this.libretaMilitar = libretaMilitar;
    }

    public EstadoCivil getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(EstadoCivil estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public Genero getGenero() {
        return genero;
    }

    public void setGenero(Genero genero) {
        this.genero = genero;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public TipoEmpleado getTipoEmpleado() {
        return tipoEmpleado;
    }

    public void setTipoEmpleado(TipoEmpleado tipoEmpleado) {
        this.tipoEmpleado = tipoEmpleado;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public List<Contrato> getContratos() {
        return contratos;
    }

    public void setContratos(List<Contrato> contratos) {
        this.contratos = contratos;
    }

    public List<Familiar> getFamiliares() {
        return familiares;
    }

    public void setFamiliares(List<Familiar> familiares) {
        this.familiares = familiares;
    }

    public void actualizarDatos(DatosActualizarEmpleado datos) {
    }

    public List<Curso> getCursos() {
        return cursos;
    }

    public void setCursos(List<Curso> cursos) {
        this.cursos = cursos;
    }

    public List<Estudio> getEstudios() {
        return estudios;
    }

    public void setEstudios(List<Estudio> estudios) {
        this.estudios = estudios;
    }
    /*public Long getEmpleadoId() {
        return id;
    }*/
}

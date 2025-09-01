package proyectoVigitecolSpringBoot.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import proyectoVigitecolSpringBoot.domain.empleado.*;

import java.util.List;

@RestController
@RequestMapping("/empleados")
@CrossOrigin(origins = "http://localhost:3000")
public class EmpleadoController {

    private final EmpleadoService empleadoService;

    public EmpleadoController(EmpleadoService empleadoService) {
        this.empleadoService = empleadoService;
    }

    @PostMapping
    public ResponseEntity<DatosRespuestaEmpleado> registrarEmpleado(
            @RequestBody @Valid DatosRegistroEmpleado datos,
            UriComponentsBuilder uriComponentsBuilder) {
        return empleadoService.registrarEmpleado(datos, uriComponentsBuilder);
    }
    @GetMapping("/activos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos")Pageable paginacion) {
        return empleadoService.listarEmpleadosActivos(paginacion);
    }
    @GetMapping("/inactivos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosInactivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos")Pageable paginacion) {
        return empleadoService.listarEmpleadosInactivos(paginacion);
    }
    @PutMapping
    public ResponseEntity<DatosRespuestaEmpleado> actualizarEmpleado(
            @RequestBody @Valid DatosActualizarEmpleado datos) {
        return empleadoService.actualizarEmpleado(datos);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarEmpleado(@PathVariable Long id) {
       return empleadoService.eliminarEmpleado(id);
    }
    @GetMapping("/obteneractivos/{id}")
    public ResponseEntity<DatosActualizarEmpleado> obtenerDatosEmpleado(@PathVariable Long id) {
        return empleadoService.obtenerDatosEmpleadoActivo(id);
    }
    @GetMapping("/obtenerinactivos/{id}")
    public ResponseEntity<DatosActualizarEmpleado> obtenerEmpleadoInactivo(@PathVariable Long id) {
        return empleadoService.obtenerDatosEmpleadoInactivo(id);
    }
    @GetMapping("/buscar/activos")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarActivosPorNombre(@RequestParam String filtro) {
        return empleadoService.buscarEmpleadosActivosPorNombre(filtro);
    }
    @GetMapping("/buscar/activos/documento")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarActivosPorDocumento(@RequestParam String numeroDocumento) {
        return empleadoService.buscarEmpleadoActivoPorNumeroDocumento(numeroDocumento);
    }
    @GetMapping("/buscar/inactivos")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarInactivosPorNombre(@RequestParam String filtro) {
        return empleadoService.buscarEmpleadosInactivosPorNombre(filtro);
    }
    @GetMapping("/buscar/inactivos/documento")
    public ResponseEntity<List<DatosActualizarEmpleado>> buscarInactivosPorDocumento(@RequestParam String numeroDocumento) {
        return empleadoService.buscarEmpleadoInactivoPorNumeroDocumento(numeroDocumento);
    }
    @GetMapping("/sin-contrato")
    public ResponseEntity<Page<DatosListadoEmpleado>> listarEmpleadosSinContrato(
            @PageableDefault(size = 10, sort = "apellidos") Pageable paginacion) {
        return empleadoService.listarEmpleadosSinContrato(paginacion);
    }
    @GetMapping("/administrativos/activos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoAdministrativosActivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable paginacion) {
        return empleadoService.listarAdministrativosActivos(paginacion);
    }
    @GetMapping("/operativos/activos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoOperativosActivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable paginacion) {
        return empleadoService.listarOperativosActivos(paginacion);
    }
    @GetMapping("/supervisores/activos")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoSupervisoresActivos(
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable paginacion) {
        return empleadoService.listarSupervisoresActivos(paginacion);
    }
    @GetMapping("/activos/mayores-de-50")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivosMayoresDe50(
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "empleado.edad") Pageable paginacion) {

        Page<DatosListadoEmpleado> empleados = empleadoService
                .listarEmpleadosActivosMayoresDe50(tipoEmpleado, paginacion);
        return ResponseEntity.ok(empleados);
    }
    @GetMapping("/estado-civil")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivosPorEstadoCivil(
            @RequestParam EstadoCivil estadoCivil,
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable pageable) {

        Page<DatosListadoEmpleado> empleados = empleadoService
                .listarEmpleadosActivosPorEstadoCivil(estadoCivil, tipoEmpleado, pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/genero")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivosPorGenero(
            @RequestParam Genero genero,
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable pageable) {

        Page<DatosListadoEmpleado> empleados = empleadoService
                .listarEmpleadosActivosPorGenero(genero, tipoEmpleado, pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/libreta-militar")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivosPorLibretaMilitar(
            @RequestParam LibretaMilitar libretaMilitar,
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable pageable) {

        Page<DatosListadoEmpleado> empleados = empleadoService
                .listarEmpleadosActivosPorLibretaMilitar(libretaMilitar, tipoEmpleado, pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/por-cargo")
    public ResponseEntity<Page<DatosListadoEmpleado>> listadoEmpleadosActivosPorCargo(
            @RequestParam String cargo,
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable pageable) {

        Page<DatosListadoEmpleado> empleados = empleadoService
                .listarEmpleadosActivosPorCargo(cargo, tipoEmpleado, pageable);
        return ResponseEntity.ok(empleados);
    }

    @GetMapping("/con-familiares")
    public ResponseEntity<Page<DatosEmpleadoConFamiliaresMenoresDe12>> empleadosConFamiliares(
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConFamiliaresMenoresDe12> resultado = empleadoService
                .findConFamiliares(tipoEmpleado, pageable);

        return ResponseEntity.ok(resultado);
    }
    @GetMapping("/con-familiares-menores")
    public ResponseEntity<Page<DatosEmpleadoConFamiliaresMenoresDe12>> listadoFamiliaresMenoresDe12(
            @RequestParam(required = false) TipoEmpleado tipoEmpleado, // Nuevo parámetro
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConFamiliaresMenoresDe12> resultado = empleadoService
                .listarFamiliaresMenoresDe12(tipoEmpleado, pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/conTodosLosFamiliares")
    public ResponseEntity<Page<DatosEmpleadoConFamiliares>> empleadosConTodosLosFamiliares(
            @RequestParam(required = false) TipoEmpleado tipoEmpleado,
            @PageableDefault(size = 10, sort = {"genero"}, direction = Sort.Direction.ASC) Pageable paginacion) {

        Page<DatosEmpleadoConFamiliares> resultado = empleadoService
                .obtenerEmpleadosConTodosFamiliares(tipoEmpleado, paginacion);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/conFamiliares/genero")
    public ResponseEntity<Page<DatosEmpleadoConFamiliares>> listadoEmpleadosConFamiliaresPorGenero(
            @RequestParam(required = false) Genero genero,
            @RequestParam(required = false) TipoEmpleado tipoEmpleado,
            @PageableDefault(size = 10, sort = "empleado.apellidos") Pageable pageable) {

        Page<DatosEmpleadoConFamiliares> resultado = empleadoService
                .listarEmpleadosConFamiliaresPorGenero(genero, tipoEmpleado, pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/con-cursos")
    public ResponseEntity<Page<DatosEmpleadoConCurso>> empleadosConCursos(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConCurso> resultado = empleadoService
                .findConCurso(pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/con-cursos/por-vencer")
    public ResponseEntity<Page<DatosEmpleadoConCurso>> empleadosConCursosPorVencer(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConCurso> resultado = empleadoService.findEmpleadosConCursosPorVencer(pageable);
        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/periodo-prueba/vencido")
    public ResponseEntity<Page<DatosEmpleadoConPeriodoDePrueba>> empleadosEnPeriodoDePruebaVencido(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConPeriodoDePrueba> resultado =
                empleadoService.findEmpleadosEnPeriodoDePrueba(pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/con-estudios")
    public ResponseEntity<Page<DatosEmpleadoConEstudios>> empleadosConEstudios(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConEstudios> resultado = empleadoService
                .findConEstudios(pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/con-experiencia-laboral")
    public ResponseEntity<Page<DatosEmpleadoConExperienciaLaboral>> empleadosConExperienciasLaborales(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConExperienciaLaboral> resultado = empleadoService
                .findConExperienciasLaborales(pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/con-afiliaciones")
    public ResponseEntity<Page<DatosEmpleadoConAfiliaciones>> empleadosConAfiliaciones(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConAfiliaciones> resultado = empleadoService
                .findConAfiliaciones(pageable);

        return ResponseEntity.ok(resultado);
    }

    @GetMapping("/con-documentos")
    public ResponseEntity<Page<DatosEmpleadoConDocumentos>> empleadosConDocumentos(
            @PageableDefault(size = 10, sort = "apellidos") Pageable pageable) {

        Page<DatosEmpleadoConDocumentos> resultado = empleadoService
                .findConDocumentos(pageable);

        return ResponseEntity.ok(resultado);
    }
}
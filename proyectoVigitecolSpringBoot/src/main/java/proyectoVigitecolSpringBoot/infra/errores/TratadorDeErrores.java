package proyectoVigitecolSpringBoot.infra.errores;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestControllerAdvice
public class TratadorDeErrores {

    //Tratando error al buscar un ID inexistente
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity tratarError404() {
        return ResponseEntity.notFound().build();
    }
    //Tratando error al envíar campos vacíos o nulos en el método POST
    //Con ayuda del DTO le indicamos al usuario cual fue el error
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity tratarError400(MethodArgumentNotValidException e){
        var errores = e.getFieldErrors().stream().map(DatosErrorValidacion::new).toList();
        return ResponseEntity.badRequest().body(errores);
    }
    //Creamos un DTO para darle tratamiento a esos errores capturando los mensajes
    private record DatosErrorValidacion(String campo, String error){
        public DatosErrorValidacion(FieldError error){
            this(error.getField(), error.getDefaultMessage());
        }
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> tratarErrorDeLectura(HttpMessageNotReadableException e) {
        Throwable causa = e.getMostSpecificCause();
        Map<String, String> error = new HashMap<>();

        if (causa instanceof DateTimeParseException || causa.getMessage().contains("LocalDate")) {
            error.put("error", "Error en el formato de fecha");
            error.put("detalle", "Verifica que las fechas tengan el formato correcto (yyyy-MM-dd)");
        } else {
            // Validación para errores en enums
            String mensaje = causa.getMessage();
            List<String> enums = List.of(
                    "LibretaMilitar",
                    "EstadoCivil",
                    "Genero",
                    "TipoDocumento",
                    "TipoEmpleado"
            );

            Optional<String> enumRelacionado = enums.stream()
                    .filter(mensaje::contains)
                    .findFirst();

            if (enumRelacionado.isPresent()) {
                error.put("campo", enumRelacionado.get().substring(0, 1).toLowerCase() + enumRelacionado.get().substring(1));
                error.put("error", "Debe seleccionar una opción válida");
            } else {
                error.put("error", "Error en el formato del JSON");
                error.put("detalle", mensaje);
            }
        }

        return ResponseEntity.badRequest().body(error);
    }

    //Tratando error cuando enviamos un correo duplicado
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity tratarErrorRuntime(RuntimeException e){
        return ResponseEntity.badRequest().body(new DatosErrorGeneral(e.getMessage()));
    }

    //Creamos el DTO para tratar este error
    private record DatosErrorGeneral(String error){}

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Map<String, String>> tratarErrorTipoParametro(MethodArgumentTypeMismatchException e) {
        Map<String, String> error = new HashMap<>();

        if (e.getRequiredType() != null && e.getRequiredType().isEnum()) {
            String campo = e.getName();
            error.put("campo", campo);
            error.put("error", "Debe seleccionar una opción válida para " + campo);
        } else {
            error.put("error", "Parámetro inválido");
            error.put("detalle", e.getMessage());
        }

        return ResponseEntity.badRequest().body(error);
    }
}

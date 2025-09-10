package proyectoVigitecolSpringBoot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @GetMapping("/admin")
    public String endpointAdmin() {
        return "Solo ADMIN puede ver esto";
    }

    @GetMapping("/rrhh")
    public String endpointRRHH() {
        return "ADMIN y RRHH pueden ver esto";
    }

    @GetMapping("/user")
    public String endpointUser() {
        return "Todos los roles autenticados pueden ver esto";
    }

    @GetMapping("/public")
    public String endpointPublic() {
        return "Cualquiera puede ver esto (sin autenticación)";
    }
}

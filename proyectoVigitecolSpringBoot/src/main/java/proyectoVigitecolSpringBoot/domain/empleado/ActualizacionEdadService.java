package proyectoVigitecolSpringBoot.domain.empleado;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Service
public class ActualizacionEdadService {
    @Autowired
    private EmpleadoRepository empleadoRepository;

    @Scheduled(cron = "0 0 0 * * *") // todos los días a las 00:00
    public void actualizarEdades() {
        List<Empleado> empleados = empleadoRepository.findAll();

        for (Empleado e : empleados) {
            int edadCalculada = Period.between(e.getFechaNacimiento(), LocalDate.now()).getYears();
            if (e.getEdad() != edadCalculada) {
                e.setEdad(edadCalculada);
                empleadoRepository.save(e);
            }
        }

        System.out.println("✅ Edades actualizadas: " + LocalDate.now());
    }
}

package br.edu.ufop.web.sales.config;

import br.edu.ufop.web.sales.entity.EventEntity;
import br.edu.ufop.web.sales.entity.UserEntity;
import br.edu.ufop.web.sales.enums.EnumUserType;
import br.edu.ufop.web.sales.enums.EventType;
import br.edu.ufop.web.sales.repository.EventRepository;
import br.edu.ufop.web.sales.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDateTime;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
@Profile("!test")
public class DataSeeder implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedEvents();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        UserEntity admin = new UserEntity();
        admin.setName("Admin User");
        admin.setEmail("admin@ufop.edu.br");
        admin.setPassword("123456");
        admin.setCity("Ouro Preto");
        admin.setType(EnumUserType.ADMIN); 

        UserEntity client = new UserEntity();
        client.setName("Cliente João");
        client.setEmail("joao@gmail.com");
        client.setPassword("123456");
        client.setCity("Mariana");
        client.setType(EnumUserType.CUSTOMER); 

        userRepository.saveAll(Arrays.asList(admin, client));
        System.out.println(">>> Usuários criados com sucesso!");
    }

    private void seedEvents() {
        if (eventRepository.count() > 0) return;

        EventEntity rockInRio = new EventEntity();
        rockInRio.setDescription("Rock in Rio 2026");
        rockInRio.setType(EventType.SHOW);
        rockInRio.setPrice(700.00f);
        rockInRio.setDate(LocalDateTime.now().plusMonths(6));
        rockInRio.setStartSales(LocalDateTime.now().minusDays(10));
        rockInRio.setEndSales(LocalDateTime.now().plusMonths(5));

        EventEntity cursoJava = new EventEntity();
        cursoJava.setDescription("Workshop Spring Boot");
        cursoJava.setType(EventType.CURSO);
        cursoJava.setPrice(150.00f);
        cursoJava.setDate(LocalDateTime.now().plusMonths(1));
        cursoJava.setStartSales(LocalDateTime.now().minusDays(5));
        cursoJava.setEndSales(LocalDateTime.now().plusDays(20));

        eventRepository.saveAll(Arrays.asList(rockInRio, cursoJava));
        System.out.println(">>> Eventos criados com sucesso!");
    }
}
package it.unipd.webapp.devicemanagement;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@Slf4j
@EnableGlobalMethodSecurity(securedEnabled = true)
public class Application {

	public static void main(String[] args) {
		log.info("Initializing application...");
		SpringApplication.run(Application.class, args);
	}

	@RequestMapping("/")
	public String index() {
		return "Greetings from Spring Boot!";
	}

}

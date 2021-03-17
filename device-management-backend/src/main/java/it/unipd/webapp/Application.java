package it.unipd.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

@SpringBootApplication
@RestController
public class Application {

	private static final Logger logger = Logger.getLogger(Application.class.getName());

	public static void main(String[] args) {
		logger.info("Initializing application...");
		SpringApplication.run(Application.class, args);
	}

	@RequestMapping("/")
	public String index() {
		return "Greetings from Spring Boot!";
	}

}

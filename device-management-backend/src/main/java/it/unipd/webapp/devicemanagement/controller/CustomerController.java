package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("")
public class CustomerController {
    
    @Autowired
    private CustomerRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @GetMapping("/customer")
    public List<Customer> getAllCustomers() {
        log.info("getAllCustomers");
        return repository.findAll();
    }

    @Secured("ROLE_DEVICE")
    @GetMapping("/device/me")
    public String loggedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        log.info("Received request with role: " + auth.getAuthorities().toString());
        return auth.getName();
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable(value = "id") long customerId) throws ResourceNotFoundException {
        log.info("getCustomerById");
        Customer customer = repository.findById(customerId).
                orElseThrow(() -> new ResourceNotFoundException("customer not found for id:: " + customerId));
        return ResponseEntity.ok().body(customer);

    }

    @PostMapping("/register")
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        log.info("register");
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return repository.save(customer);
    }

    @PutMapping("/customer/{id}")
    public ResponseEntity<Customer> customerById(
            @PathVariable(value = "id") long customerId,
            @Valid @RequestBody Customer updatedCustomer
    ) throws ResourceNotFoundException {

        log.info("customerById");
        Customer customer = repository.findById(customerId).
                orElseThrow(() -> new ResourceNotFoundException("customer not found for this id:: " + customerId));
        customer.setUsername(updatedCustomer.getUsername());
        customer.setEmail(updatedCustomer.getEmail());
        repository.save(customer);
        return ResponseEntity.ok().body(customer);
    }

    @DeleteMapping("/customer/{id}")
    public void deleteCustomer(@PathVariable(value = "id") long customerId) throws ResourceNotFoundException {
        log.info("deleteCustomer");
        Customer customer = repository.findById(customerId).
                orElseThrow(() -> new ResourceNotFoundException("customer not found for this id:: " + customerId));
        repository.delete(customer);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class) // handler for not @Valid requests
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return errors;
    }
}
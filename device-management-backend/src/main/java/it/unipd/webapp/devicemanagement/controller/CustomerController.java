package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ConflictException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.ClientMessage;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.service.CustomerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@Slf4j
@RequestMapping("/customer")
public class CustomerController {

    @Autowired
    private CustomerService service;


    @GetMapping("/me")
    public Customer currentLoggedUser() {
        log.debug("currentLoggedUser");
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @DeleteMapping("/me")
    public ResponseEntity<ClientMessage> deleteLoggedCustomer() throws ResourceNotFoundException {
        log.debug("deleteLoggedCustomer");
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.deleteCustomer(loggedCustomer.getId());

        var message = new ClientMessage(String.format("customer %s deleted", loggedCustomer.getUsername()));
        return ResponseEntity.ok().body(message);
    }

    @PutMapping("/me")
    public ResponseEntity<Customer> updateLoggedUser(@Valid @RequestBody Customer updatedCustomer) throws ResourceNotFoundException {
        log.debug("updateLoggedUser");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var newCustomer = service.updateCustomer(loggedCustomer.getId(), updatedCustomer);

        return ResponseEntity.ok().body(newCustomer);
    }

    @PostMapping("/me/upgrade")
    public ResponseEntity<ClientMessage> upgradeLoggedCustomerPlan() throws ResourceNotFoundException {
        log.debug("upgradeLoggedCustomerPlan");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.upgradeCustomerPlan(loggedCustomer.getId());

        var message = new ClientMessage("successfully upgraded plan");
        return ResponseEntity.ok().body(message);
    }

    @PostMapping("/register")
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) throws ConflictException {
        log.debug("register");
        var createdCustomer = service.registerCustomer(customer);

        return ResponseEntity.ok().body(createdCustomer);
    }

    @PostMapping("/login")
    public void login() {
        // Nothing to do, authentication performed by filters
    }

    @PostMapping("/logout")
    public void logout() {
        // Nothing to do, logout performed by spring security
    }
}
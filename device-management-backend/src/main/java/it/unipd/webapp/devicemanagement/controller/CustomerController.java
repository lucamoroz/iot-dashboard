package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ConflictException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.ClientMessage;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
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

    @Autowired
    private CustomerRepository repository;

    /**
     * Get logged customer
     * @return the logged customer
     * @throws ResourceNotFoundException if logged customer couldn't be found in the data source
     */
    @GetMapping("/me")
    public ResponseEntity<Customer> currentLoggedUser() throws ResourceNotFoundException {
        log.debug("currentLoggedUser");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var customer = repository.findById(loggedCustomer.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Couldn't find customer with id %d", loggedCustomer.getId())
        ));

        return ResponseEntity.ok().body(customer);
    }

    /**
     * Delete logged customer
     * @return success client message
     * @throws ResourceNotFoundException if logged customer couldn't be found in the data source
     */
    @DeleteMapping("/me")
    public ResponseEntity<ClientMessage> deleteLoggedCustomer() throws ResourceNotFoundException {
        log.debug("deleteLoggedCustomer");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.deleteCustomer(loggedCustomer.getId());

        var message = new ClientMessage(String.format("Customer %s deleted.", loggedCustomer.getUsername()));
        return ResponseEntity.ok().body(message);
    }

    /**
     * Update logged customer. Only password field is considered
     * @param updatedCustomer updated customer
     * @return the updated customer
     * @throws ResourceNotFoundException if logged customer is not found
     */
    @PutMapping("/me")
    public ResponseEntity<Customer> updateLoggedUser(@Valid @RequestBody Customer updatedCustomer) throws ResourceNotFoundException {
        log.debug("updateLoggedUser");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var newCustomer = service.updateCustomer(loggedCustomer.getId(), updatedCustomer);

        return ResponseEntity.ok().body(newCustomer);
    }

    /**
     * Upgrade the plan of the logged customer
     * @return a success message for the client
     * @throws ResourceNotFoundException if logged customer is not found
     */
    @PostMapping("/me/upgrade")
    public ResponseEntity<ClientMessage> upgradeLoggedCustomerPlan() throws ResourceNotFoundException {
        log.debug("upgradeLoggedCustomerPlan");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        service.upgradeCustomerPlan(loggedCustomer.getId());

        var message = new ClientMessage("Successfully upgraded plan.");
        return ResponseEntity.ok().body(message);
    }


    /**
     * Create a new customer and save it in the data source
     * @param customer customer that satisfies the validation constraints
     * @return the created customer
     * @throws ConflictException if an uniqueness constraint is violated
     */
    @PostMapping(value = "/register")
    public ResponseEntity<Customer> createCustomer(@Valid @RequestBody Customer customer) throws ConflictException {
        log.debug("register");
        var createdCustomer = service.registerCustomer(customer);

        return ResponseEntity.ok().body(createdCustomer);
    }
}
package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.BadRequestException;
import it.unipd.webapp.devicemanagement.exception.ConflictException;
import it.unipd.webapp.devicemanagement.exception.ErrorCode;
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
    public ResponseEntity<Customer> currentLoggedCustomer() throws ResourceNotFoundException {
        log.debug("currentLoggedCustomer");
        var loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var customer = repository.findById(loggedCustomer.getId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Couldn't find customer with id %d", loggedCustomer.getId()),
                        ErrorCode.ECUS1));
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
     * Update logged customer. Only username and password field are considered
     * @param updatedCustomer updated customer
     * @return the updated customer
     * @throws ResourceNotFoundException if logged customer is not found
     */
    @PutMapping("/me")
    public ResponseEntity<Customer> updateLoggedCustomer(@RequestBody Customer updatedCustomer)
            throws ResourceNotFoundException, BadRequestException {
        log.debug("updateLoggedCustomer");

        if (updatedCustomer.getUsername() == null || updatedCustomer.getUsername().isBlank()) {
            throw new BadRequestException("Missing customer email", ErrorCode.ECUS6);
        }

        if (updatedCustomer.getPassword() == null || updatedCustomer.getPassword().isBlank()) {
            throw new BadRequestException("Missing customer email", ErrorCode.ECUS7);
        }

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
    public ResponseEntity<Customer> createCustomer(@RequestBody Customer customer)
            throws ConflictException, BadRequestException {
        log.debug("register");

        if (customer.getEmail() == null || customer.getEmail().isBlank()) {
            throw new BadRequestException("Missing customer email", ErrorCode.ECUS5);
        }

        if (customer.getUsername() == null || customer.getUsername().isBlank()) {
            throw new BadRequestException("Missing customer email", ErrorCode.ECUS6);
        }

        if (customer.getPassword() == null || customer.getPassword().isBlank()) {
            throw new BadRequestException("Missing customer email", ErrorCode.ECUS7);
        }

        var createdCustomer = service.registerCustomer(customer);

        return ResponseEntity.ok().body(createdCustomer);
    }
}
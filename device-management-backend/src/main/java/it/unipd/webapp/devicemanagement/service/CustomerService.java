package it.unipd.webapp.devicemanagement.service;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.CustomerPlan;
import it.unipd.webapp.devicemanagement.model.CustomerRole;
import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class CustomerService implements UserDetailsService {

    @Autowired
    CustomerRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        log.debug("loading user " + s);
        var customer =  repository.findByUsername(s);

        if (customer == null) {
            log.debug("user not found!");
            throw new UsernameNotFoundException("user " + s + "does not exist");
        } else {
            return customer;
        }
    }

    /**
     * Create a new customer in the data source.
     * The password will be encrypted, the Role will be set to Customer and the plan will be set to Free.
     * @param customer input data
     * @return new customer
     */
    public Customer registerCustomer(Customer customer) {
        customer.setRole(CustomerRole.ROLE_CUSTOMER);
        customer.setPlan(CustomerPlan.FREE);
        customer.setCallsCount(0);
        customer.setPassword(passwordEncoder.encode(customer.getPassword()));
        return repository.save(customer);
    }

    /**
     * Update customer data. Only password is considered.
     * @param customerId ID of customer to update
     * @param newCustomerData new customer data
     * @return updated customer
     * @throws ResourceNotFoundException if oldCustomer not found in data source
     */
    public Customer updateCustomer(Long customerId, Customer newCustomerData) throws ResourceNotFoundException {
        Customer updatedCustomer = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Couldn't find customer with id: %d", customerId)));

        updatedCustomer.setPassword(passwordEncoder.encode(newCustomerData.getPassword()));
        return repository.save(updatedCustomer);
    }

    /**
     * Delete the customer with the given id.
     * @param customerId ID of customer to delete
     * @throws ResourceNotFoundException if customer not found in data source
     */
    public void deleteCustomer(Long customerId) throws ResourceNotFoundException {
        var customerToDelete = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Couldn't find customer with id: %d", customerId)));
        repository.delete(customerToDelete);
    }

    /**
     * Upgrade the customer plan to PREMIUM.
     * @param customerId ID of customer to upgrade
     * @throws ResourceNotFoundException if customer not found in data source
     */
    public void upgradeCustomerPlan(Long customerId) throws ResourceNotFoundException {
        var customerToUpgrade = repository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Couldn't find customer with id: %d", customerId)));
        customerToUpgrade.setPlan(CustomerPlan.PREMIUM);
        repository.save(customerToUpgrade);
    }

}

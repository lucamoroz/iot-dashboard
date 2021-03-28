package it.unipd.webapp.devicemanagement.service;

import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class CustomerDetailService implements UserDetailsService {

    @Autowired
    CustomerRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        log.info("loading user " + s);
        var customer =  repository.findByUsername(s);

        if (customer == null) {
            log.info("user not found!");
            throw new UsernameNotFoundException("user " + s + "does not exist");
        } else {
            log.info("loaded user: " + customer.toString());
            return customer;
        }
    }

}

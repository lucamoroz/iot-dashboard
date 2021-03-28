package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("SELECT c FROM Customer c WHERE c.username = ?1")
    Customer findByUsername(String username);
}

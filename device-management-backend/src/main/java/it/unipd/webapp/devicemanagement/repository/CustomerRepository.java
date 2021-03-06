package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.Customer;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    @Query("SELECT c FROM Customer c WHERE c.username = :username")
    Optional<Customer> findByUsername(String username);

    @Transactional
    @Modifying
    @Query(value = "UPDATE customer SET calls_count = calls_count + 1 WHERE id = :customerId", nativeQuery = true)
    int incrementCallsCount(Long customerId);

    @Query("SELECT c FROM Customer c where c.email = :email")
    Optional<Customer> findByEmail(String email);
}

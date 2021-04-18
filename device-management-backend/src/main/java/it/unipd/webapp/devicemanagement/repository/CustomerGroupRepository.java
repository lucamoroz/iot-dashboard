package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.CustomerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerGroupRepository extends JpaRepository<CustomerGroup, Long> {

    /**
     * Queries the database the groups associated with a specified customer
     *
     * @param customerId The customer's id
     * @return A list of groups associated with the customer
     */
    @Query("SELECT g FROM customer_group g WHERE g.customer.id = ?1")
    List<CustomerGroup> findGroupsByCustomerId(long customerId);
}

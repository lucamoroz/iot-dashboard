package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.CustomerGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerGroupRepository extends JpaRepository<CustomerGroup, Long> {

    //TODO: Not needed now. Should be removed when pull request passes
    @Query("SELECT g FROM customer_group g WHERE g.customer.id = ?1")
    List<CustomerGroup> findGroupsByCustomerId(long customerId);
}

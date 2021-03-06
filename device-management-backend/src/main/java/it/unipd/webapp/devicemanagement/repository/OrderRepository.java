package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderDetail, Long>{

    //Query List of all completed orders of customer with id=1234
    //@Query(value="SELECT DISTINCT * FROM order_detail WHERE customer_id=:customerId AND completed=TRUE", nativeQuery = true)
    @Query("SELECT od FROM order_detail od WHERE od.customer.id=:customerId AND od.completed=TRUE")
    List<OrderDetail> completedOrders(long customerId);

    //Cart information: Query the unique non completed order of customer with id=1234.
    @Query(value="SELECT DISTINCT * FROM order_detail WHERE customer_id=:customerId AND completed=FALSE", nativeQuery = true)
    Optional<OrderDetail> notcompletedOrders(long customerId);

    //Check if the order with order_id=1234 is of customer with id=1234
    @Query(value="SELECT DISTINCT * FROM order_detail WHERE customer_id=:customerId AND id=:orderId", nativeQuery = true)
    Optional<OrderDetail> checkOrderCustomerMatch(long customerId,long orderId);



}

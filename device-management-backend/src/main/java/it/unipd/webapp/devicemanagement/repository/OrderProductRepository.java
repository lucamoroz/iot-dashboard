package it.unipd.webapp.devicemanagement.repository;


import it.unipd.webapp.devicemanagement.model.OrderProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {
}

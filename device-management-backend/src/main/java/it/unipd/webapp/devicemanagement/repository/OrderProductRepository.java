package it.unipd.webapp.devicemanagement.repository;


import it.unipd.webapp.devicemanagement.model.OrderProduct;
import it.unipd.webapp.devicemanagement.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {

    @Query(value = "SELECT * FROM orders_products WHERE order_id=:orderId AND product_id=:productId", nativeQuery = true)
    public Optional<OrderProduct> getAll(long orderId,long productId);
}

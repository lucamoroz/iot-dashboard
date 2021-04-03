package it.unipd.webapp.devicemanagement.repository;


import it.unipd.webapp.devicemanagement.model.OrderProduct;
import it.unipd.webapp.devicemanagement.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderProductRepository extends JpaRepository<OrderProduct, Long> {

    @Query(value = "SELECT * FROM orders_products WHERE order_id=:orderId AND product_id=:productId", nativeQuery = true)
    public Optional<OrderProduct> getQuantity(long orderId,long productId);

    @Query("SELECT u from orders_products u WHERE u.order.id = ?1")
    List<OrderProduct> getByOrderId(long orderId);
    //@Query(value = "SELECT p.id, op.order_id, op.quantity, p.name, p.description, p.price FROM orders_products AS op INNER JOIN product AS p ON product_id=p.id WHERE op.order_id=orderId", nativeQuery = true)
    //public ????? getProductsOfOrder(long orderId);   // TO MODIFYYYYYY


}

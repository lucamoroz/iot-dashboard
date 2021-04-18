package it.unipd.webapp.devicemanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.unipd.webapp.devicemanagement.model.Product;



@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query(value = "SELECT * FROM product", nativeQuery = true)
    public List<Product> getAll();

    @Query(value="SELECT * FROM product WHERE id = :productId", nativeQuery = true)
    public Optional<Product> getInfo(Long productId);
}
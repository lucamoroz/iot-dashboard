package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Product;
import it.unipd.webapp.devicemanagement.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@Slf4j
@RequestMapping("/api/v1")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() throws ResourceNotFoundException {
        List<Product> productList = productRepo.getAll().orElseThrow(
            () -> new ResourceNotFoundException("No product is found")
        );

        return ResponseEntity.ok().body(productList);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductInfo(@PathVariable(value = "id") Long productId) throws ResourceNotFoundException {
        Product product = productRepo.getInfo(productId).orElseThrow(
            () -> new ResourceNotFoundException(String.format("Product with id=%d not found", productId))
        );
        
        return ResponseEntity.ok().body(product);
    }
}
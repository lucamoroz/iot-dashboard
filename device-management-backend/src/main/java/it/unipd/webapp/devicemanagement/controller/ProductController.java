package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Product;
import it.unipd.webapp.devicemanagement.repository.ProductRepository;
import it.unipd.webapp.devicemanagement.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@Slf4j
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() throws ResourceNotFoundException {
        List<Product> productList = productRepo.getAll();

        return ResponseEntity.ok().body(productList);
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductInfo(@PathVariable(value = "id") Long productId) throws ResourceNotFoundException {
        Product product = productRepo.getInfo(productId).orElseThrow(
            () -> new ResourceNotFoundException("Product with not found", ErrorCode.EPRO1)
        );
        
        return ResponseEntity.ok().body(product);
    }
}
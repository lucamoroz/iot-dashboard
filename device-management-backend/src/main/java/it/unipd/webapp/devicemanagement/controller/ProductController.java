package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.model.Product;
import it.unipd.webapp.devicemanagement.repository.ProductRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.SortedMap;
import java.util.TreeMap;


@RestController
@Slf4j
@RequestMapping("/api/v1")
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        Optional<List<Product>> productList = productRepo.getAll();
        if (productList.isEmpty()) {
            // Error: product not found
            log.info("No products available");
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok().body(productList.get());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductInfo(@PathVariable(value = "id") Long productId) {
        Optional<Product> prodData = productRepo.getInfo(productId);
        if (prodData.isEmpty()) {
            // Error: product not found
            log.info("No products available");
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok().body(prodData.get());
    }
}
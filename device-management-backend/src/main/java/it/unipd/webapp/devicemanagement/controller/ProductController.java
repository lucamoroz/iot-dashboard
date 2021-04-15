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

    /**
     * Get a list of the available products
     * @return the list of the available products or an empty list id no products are available
     */
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() throws ResourceNotFoundException {
        List<Product> productList = productRepo.getAll();

        return ResponseEntity.ok().body(productList);
    }

    /**
     * Get a product by id
     * @param productId Id of the product to retrieve
     * @return the product the id is given
     * @throws ResourceNotFoundException In case no product with such and id is found
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProductInfo(@PathVariable(value = "id") Long productId) throws ResourceNotFoundException {
        Product product = productRepo.getInfo(productId).orElseThrow(
            () -> new ResourceNotFoundException("Product with not found", ErrorCode.EPRO1)
        );
        
        return ResponseEntity.ok().body(product);
    }
}
package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.OrderDetail;
import it.unipd.webapp.devicemanagement.model.OrderProduct;
import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import it.unipd.webapp.devicemanagement.repository.OrderProductRepository;
import it.unipd.webapp.devicemanagement.repository.OrderRepository;
import it.unipd.webapp.devicemanagement.repository.ProductRepository;
import it.unipd.webapp.devicemanagement.model.Product;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@RestController
@Slf4j
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private OrderProductRepository order_productRepo;

    // This method can be replaced by a Customer static method
    private Customer getLoggedCustomer() {
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    //Cart information: Query the unique non completed order of customer with id=1234.
    @GetMapping("/cartInfo")
    public ResponseEntity<OrderDetail> chartInfo(){
        log.debug("getNotcompletedOrders");
        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get the unique not completed order
        Optional<OrderDetail> order=orderRepo.notcompletedOrders(customerId);

        // if the there are no not-completed orders, create one
        if(order.isEmpty()){
            log.debug("not-completed Order does not exist! This shouldn happen.");
            OrderDetail orderToAdd=new OrderDetail();
            orderToAdd.setAddress("");
            orderToAdd.setCustomer(getLoggedCustomer());
            Date date = new Date();
            date.setTime(date.getTime());   //???
            orderToAdd.setTimestamp(date);

            orderRepo.save(orderToAdd);
            return ResponseEntity.ok().body(orderToAdd);

        }

        return ResponseEntity.ok().body(order.get());
    }


    //Query List of all completed orders of customer with id=1234
    @GetMapping("/completedOrders")
    public ResponseEntity<List<OrderDetail>> completedOrders(){
        log.debug("getCompletedOrders");

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get the list of completed order of the user with id = customerId
        Optional<List<OrderDetail>> orders=orderRepo.completedOrders(customerId);

        return ResponseEntity.ok().body(orders.get());
    }

    //Add product to cart
    @GetMapping("/addProductToCart/{id}")
    public ResponseEntity<OrderProduct> addProductToCart(@PathVariable(value = "id") long productId){
        log.debug("addProductToCart");

        // to execute this query we need get the product and the order(cart) entities.

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get non-complete order info (cart)
        OrderDetail cart;
        //get the unique not completed order
        Optional<OrderDetail> order=orderRepo.notcompletedOrders(customerId);
        // if the there are no not-completed orders, create one
        if(order.isEmpty()){
            log.debug("not-completed Order does not exist! This should not happen.");
            OrderDetail orderToAdd=new OrderDetail();
            orderToAdd.setAddress("");
            orderToAdd.setCustomer(getLoggedCustomer());
            Date date = new Date();
            date.setTime(date.getTime());   //???
            orderToAdd.setTimestamp(date);
            orderRepo.save(orderToAdd);
            cart=orderToAdd;
        }else{
            cart=order.get();
        }

        //get the product corresponding to the id given or return an error.
        Optional<Product> prodData = productRepo.getInfo(productId);
        if (prodData.isEmpty()) {
            // Error: product not found
            log.debug("The product does not exists");
            return ResponseEntity.notFound().build();
        }


        //check if the pair (order_id,product_id) already present in the orders_products table. (That mean there was already some quantity of that product in the cart)
        Optional<OrderProduct> ordprod=order_productRepo.getQuantity(cart.getId(), prodData.get().getId());
        if(ordprod.isEmpty()){
            log.debug("The product was not in the cart, so we add it");
            //that product wasn't in the cart, so insert 1 unit of it
            OrderProduct order_product = new OrderProduct();
            order_product.setQuantity(1);
            order_product.setOrder(cart);
            order_product.setProduct(prodData.get());
            order_productRepo.save(order_product);
            //return
            return ResponseEntity.ok(order_product);
        }else{
            log.debug("The product was already in the cart, so quantity+=1");
            // there was already some quantity of that product, so just add +1
            OrderProduct order_product=ordprod.get();
            order_product.setQuantity(order_product.getQuantity()+1);
            order_productRepo.save(order_product);
            //return
            return ResponseEntity.ok(order_product);
        }

    }

    //Remove item from the cart
    @GetMapping("/removeProductFromCart/{id}")
    public ResponseEntity<OrderProduct> removeProductFromCart(@PathVariable(value = "id") long productId) {
        log.debug("removeProductFromCart");

        //get customerId
        long customerId=getLoggedCustomer().getId();

        //get non-complete order info (cart)
        OrderDetail cart;
        //get the unique not completed order
        Optional<OrderDetail> order=orderRepo.notcompletedOrders(customerId);
        // if the there are no not-completed orders, create one
        if(order.isEmpty()){
            log.debug("not-completed Order does not exist! This should not happen.");
            OrderDetail orderToAdd=new OrderDetail();
            orderToAdd.setAddress("");
            orderToAdd.setCustomer(getLoggedCustomer());
            Date date = new Date();
            date.setTime(date.getTime());   //???
            orderToAdd.setTimestamp(date);
            orderRepo.save(orderToAdd);
            cart=orderToAdd;
        }else{
            cart=order.get();
        }

        //get the product corresponding to the id given or return an error.
        Optional<Product> prodData = productRepo.getInfo(productId);
        if (prodData.isEmpty()) {
            // Error: product not found
            log.debug("The product does not exists");
            return ResponseEntity.notFound().build();
        }

        //delete, if the product or the cart does not exist doesn't matter.
        //check if the pair (order_id,product_id) is present in the orders_products table.
        Optional<OrderProduct> ordprod=order_productRepo.getQuantity(cart.getId(), prodData.get().getId());
        if(ordprod.isEmpty()){
            log.debug("The product was not in the cart");
            //that product wasn't in the cart
            //return
            return ResponseEntity.notFound().build();
        }else{
            log.debug("The product was in the cart, so we delete it");
            // The product was in the cart, so we delete it
            order_productRepo.delete(ordprod.get());
            //return
            return ResponseEntity.ok().build();
        }

    }

}

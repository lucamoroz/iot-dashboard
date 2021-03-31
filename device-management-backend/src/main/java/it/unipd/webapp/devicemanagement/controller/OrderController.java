package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.OrderDetail;
import it.unipd.webapp.devicemanagement.model.OrderProduct;
import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import it.unipd.webapp.devicemanagement.repository.OrderRepository;
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

    // This method can be replaced by a Customer static method
    private Customer getLoggedCustomer() {
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    //Cart information: Query the unique non completed order of customer with id=1234.
    @GetMapping("/cartInfo/")
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


}

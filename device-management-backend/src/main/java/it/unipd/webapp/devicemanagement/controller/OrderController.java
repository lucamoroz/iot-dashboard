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
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequestMapping("/api/v1")
public class OrderController {

/*
*
- Add element to chart: put the product on the unique non-completed order.
- Buy button (on the chart): update from non-completed to completed, update timestamp, update address.
    - create new empty, non-completed order
    - for each product, for each quantity: create device
- Remove item from non-completed order
- Change quantity of a item on a non-completed order:
- Query List of all completed orders of customer with id=1234
- Go to the chart: Query the unique non completed order of customer with id=1234 and the products associated
- Query list of products of order with id=1234
*
* */

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/chart/{id}")
    public ResponseEntity<List> chart(
            @PathVariable(value = "id") long customerId
    )throws ResourceNotFoundException{
        // to continueeeeeeeeeeeeeeeeeee
        OrderDetail o=orderRepository.findById(customerId);
        return ResponseEntity.ok().body(new List<>);
    }


}

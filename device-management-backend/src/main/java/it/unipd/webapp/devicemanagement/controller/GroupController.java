package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.CustomerGroup;
import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.repository.CustomerGroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1")
public class GroupController {

    @Autowired
    private CustomerGroupRepository repository;

    @GetMapping("/group/{customer_id}")
    public ResponseEntity<List<CustomerGroup>> getGroups(@PathVariable(value = "customer_id") long customerId) throws RuntimeException {
        List<CustomerGroup> groups = repository.findGroupsByCustomerId(customerId);
        return ResponseEntity.ok(groups);
    }
}

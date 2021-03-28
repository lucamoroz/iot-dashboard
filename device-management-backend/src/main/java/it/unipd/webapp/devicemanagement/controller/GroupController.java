package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ForbiddenException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.CustomerGroup;
import it.unipd.webapp.devicemanagement.repository.CustomerGroupRepository;
import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import lombok.SneakyThrows;
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
    private CustomerGroupRepository groupRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/{customer_id}/groups")
    public ResponseEntity<List<CustomerGroup>> getGroups(@PathVariable(value = "customer_id") long customerId) throws ResourceNotFoundException {
        // Getting the customer in order to know whether the customer passed exists or not.
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer " +customerId+ " does not exist"));
        List<CustomerGroup> groups = customer.getGroups();


        // We could directly obtain the groups available to a customer but we do not know whether the customer exists or
        // no. When the customer does not exist an empty list is returned.
        // We may want to know the difference between having a customer that does not have any group and a customer that
        // does not exist.
        //List<CustomerGroup> groups = groupRepository.findGroupsByCustomerId(customerId);


        return ResponseEntity.ok(groups);
    }

    @PutMapping("/{customer_id}/addgroup")
    public @ResponseBody String addGroup(@PathVariable(value = "customer_id") long customerId, @RequestParam String name) throws ResourceNotFoundException {
        CustomerGroup groupToAdd = new CustomerGroup();
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer " +customerId+ " not found"));
        groupToAdd.setName(name);
        groupToAdd.setCustomer(customer);
        groupRepository.save(groupToAdd);
        return "Group Saved";
    }

    @SneakyThrows
    @DeleteMapping("/{customer_id}/deletegroup")
    public @ResponseBody String deleteGroup(@PathVariable(value = "customer_id") long customerId, @RequestParam long groupId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer " +customerId+ " not found"));
        List<CustomerGroup> groups = customer.getGroups();
        // The only one whose allowed to delete the group is the customer which has the group. So we have to check when
        // the group to delete is among the groups owned by the customer

        CustomerGroup groupToDelete = groups.stream().filter(g -> g.getId() == groupId).findAny()
                .orElseThrow(() -> {

                    // If the group is found here, it means that the group belongs to another customer where the id != customerId.
                    // So when this happen, we have to throw a security exception
                    CustomerGroup cg = groupRepository.findById(groupId).orElse(null);
                    if (cg != null) return new ForbiddenException("Customer " +customerId+ " is not allowed to delete group " +groupId);

                    // The group is not found so we are sure that the groupId does not exist in the database
                    return new ResourceNotFoundException("Group " +groupId+ " not found");
                });
        groupRepository.delete(groupToDelete);
        return "Group Deleted";
    }
}

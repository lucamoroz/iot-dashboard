package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ForbiddenException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.ClientMessage;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.CustomerGroup;
import it.unipd.webapp.devicemanagement.repository.CustomerGroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/api/v1")
public class GroupController {

    @Autowired
    private CustomerGroupRepository groupRepository;

    // This method can be replaced by a Customer static method
    private Customer getLoggedCustomer() {
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping("/groups")
    public ResponseEntity<List<CustomerGroup>> getGroups() {
        Customer customer = getLoggedCustomer();
        List<CustomerGroup> groups = groupRepository.findGroupsByCustomerId(customer.getId());
        return ResponseEntity.ok(groups);
    }

    @PutMapping("/addgroup")
    public ResponseEntity<ClientMessage> addGroup(@RequestParam String name) {
        CustomerGroup groupToAdd = new CustomerGroup();
        Customer customer = getLoggedCustomer();
        groupToAdd.setName(name);
        groupToAdd.setCustomer(customer);
        groupRepository.save(groupToAdd);
        ClientMessage clientMessage = new ClientMessage("Group added");
        return ResponseEntity.ok(clientMessage);
    }


    @DeleteMapping("/deletegroup")
    public ResponseEntity<ClientMessage> deleteGroup(@RequestParam long groupId) throws ResourceNotFoundException, ForbiddenException {

        Customer customer = getLoggedCustomer();
        List<CustomerGroup> groups = groupRepository.findGroupsByCustomerId(customer.getId());
        // The only one whose allowed to delete the group is the customer which has the group. So we have to check when
        // the group to delete is among the groups owned by the customer

        CustomerGroup groupToDelete = groups.stream().filter(g -> g.getId() == groupId).findAny().orElse(null);
        if (groupToDelete == null) {
            // If the group is found here, it means that the group belongs to another customer where the id != customerId.
            // So when this happen, we have to send an error to the client
            CustomerGroup cg = groupRepository.findById(groupId).orElse(null);
            if (cg != null) throw new ForbiddenException("Customer " +customer.getId()+ " is not allowed to delete group " +groupId);

            // The group is not found so we are sure that the groupId does not exist in the database
            throw new ResourceNotFoundException("Group " +groupId+ " not found");
        }
        groupRepository.delete(groupToDelete);
        ClientMessage clientMessage = new ClientMessage("Group deleted");
        return ResponseEntity.ok(clientMessage);
    }
}

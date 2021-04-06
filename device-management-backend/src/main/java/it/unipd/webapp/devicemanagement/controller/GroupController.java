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
@RequestMapping("/groups")
public class GroupController {

    @Autowired
    private CustomerGroupRepository groupRepository;

    // This method can be replaced by a Customer static method
    private Customer getLoggedCustomer() {
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    /**
     * Shows to the users the groups he owns
     *
     * @return A response with the group list
     */
    @GetMapping("") // Empty mapping is correct
    public ResponseEntity<List<CustomerGroup>> getGroups() {
        Customer customer = getLoggedCustomer();
        List<CustomerGroup> groups = groupRepository.findGroupsByCustomerId(customer.getId());
        return ResponseEntity.ok(groups);
    }

    /**
     * Adds a new group for the logged user
     *
     * @param name The name given for the group
     * @return The 200 ok response message is always returned
     */
    @PostMapping("/add/{name}")
    public ResponseEntity<ClientMessage> addGroup(@PathVariable("name") String name) {
        CustomerGroup groupToAdd = new CustomerGroup();
        Customer customer = getLoggedCustomer();
        groupToAdd.setName(name);
        groupToAdd.setCustomer(customer);
        groupRepository.save(groupToAdd);
        ClientMessage clientMessage = new ClientMessage("Group added");
        return ResponseEntity.ok(clientMessage);
    }


    /**
     * Deletes the group specified by the user
     *
     * @param groupId The group id whose the user want to delete
     * @return A response message if the operation is completed successfully
     * @throws ResourceNotFoundException When no group with specified id is found
     */
    @DeleteMapping("/{id}/delete")
    public ResponseEntity<ClientMessage> deleteGroup(@PathVariable("id") long groupId) throws ResourceNotFoundException {

        Customer customer = getLoggedCustomer();
        List<CustomerGroup> groups = groupRepository.findGroupsByCustomerId(customer.getId());
        // The only one whose allowed to delete the group is the customer which has the group. So we have to check when
        // the group to delete is among the groups owned by the customer

        CustomerGroup groupToDelete = groups.stream().filter(g -> g.getId() == groupId).findAny().orElse(null);
        if (groupToDelete == null) {
            // If the group is found here, it means that the group belongs to another customer where the id != customerId.
            // So when this happen, we have to send an error to the client or at least show a debug message which tells us
            // what's going on
            CustomerGroup cg = groupRepository.findById(groupId).orElse(null);

            if (cg != null) {
                log.debug("Customer " +customer.getId()+ " is not allowed to delete group " +groupId);
                // Show this message only for debugging purposes. In production the user shouldn't know that he passed
                // the group id of another user
                throw new ResourceNotFoundException("Customer " +customer.getId()+ " is not allowed to delete group " +groupId);
            }

            // The group is not found so we are sure that the groupId does not exist in the database
            throw new ResourceNotFoundException("Group " +groupId+ " not found");
        }
        groupRepository.delete(groupToDelete);
        ClientMessage clientMessage = new ClientMessage("Group deleted");
        return ResponseEntity.ok(clientMessage);
    }

    //TODO: No needed to obtain the devices from a group. It can be removed
    ///**
    // * Gets the device list which the selected group owns
    // *
    // * @param groupId The group whose the user wants to get devices information
    // * @return The response with the group details
    // * @throws ResourceNotFoundException When no group with specified id is found
    // * @throws ForbiddenException When an user tries to look at a group that he doesn't own
    // */
    /*@GetMapping("{id}")
    public ResponseEntity<List<Device>> getDevices(@PathVariable("id") long groupId) throws ResourceNotFoundException, ForbiddenException {
        Customer customer = getLoggedCustomer();
        // The only one whose allowed to show the group is the customer which has the group. So we have to check when
        // the group to delete is among the groups owned by the customer
        CustomerGroup groupToShow = groupRepository.findGroupsByCustomerId(customer.getId()).stream()
                .filter(g -> g.getId() == groupId).findAny().orElse(null);
        if (groupToShow == null) {
            // If the group is found here, it means that the group belongs to another customer where the id != customerId.
            // So when this happen, we have to send an error to the client
            CustomerGroup cg = groupRepository.findById(groupId).orElse(null);
            if (cg != null) throw new ForbiddenException("Customer " +customer.getId()+ " is not allowed to look at group " +groupId);

            // The group is not found so we are sure that the groupId does not exist in the database
            throw new ResourceNotFoundException("Group " +groupId+ " not found");
        }
        return ResponseEntity.ok(groupToShow.getDevices());
    }*/
}

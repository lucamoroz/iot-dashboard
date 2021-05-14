package it.unipd.webapp.devicemanagement.service;

import it.unipd.webapp.devicemanagement.exception.ErrorCode;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.CustomerGroup;
import it.unipd.webapp.devicemanagement.repository.CustomerGroupRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class GroupService {

    @Autowired
    private CustomerGroupRepository groupRepository;

    public CustomerGroup getCustomerGroupById(long groupId) throws ResourceNotFoundException {
        Customer customer = getLoggedCustomer();
        List<CustomerGroup> groups = groupRepository.findGroupsByCustomerId(customer.getId());
        // The only one whose allowed to delete the group is the customer which has the group. So we have to check when
        // the group to delete is among the groups owned by the customer

        CustomerGroup group = groups.stream().filter(g -> g.getId() == groupId).findAny().orElse(null);
        if (group == null) {
            // If the group is found here, it means that the group belongs to another customer where the id != customerId.
            // So when this happen, we have to send an error to the client or at least show a debug message which tells us
            // what's going on
            CustomerGroup cg = groupRepository.findById(groupId).orElse(null);

            if (cg != null) {
                // Show this message only for debugging purposes. In production the user shouldn't know that he passed
                // the group id of another user
                throw new ResourceNotFoundException("Customer " +customer.getId()+ " is not allowed to delete group " +groupId, ErrorCode.ECGR1);
            }

            // The group is not found so we are sure that the groupId does not exist in the database
            throw new ResourceNotFoundException("Group " +groupId+ " not found", ErrorCode.ECGR1);
        }

        return group;
    }

    private Customer getLoggedCustomer() {
        return (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}

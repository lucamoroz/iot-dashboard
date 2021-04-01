package it.unipd.webapp.devicemanagement.controller;

import antlr.Token;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.ClientMessage;
import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.model.DeviceConfig;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import it.unipd.webapp.devicemanagement.model.Customer;

@RestController
@Slf4j
@RequestMapping("/api/v1")
public class DeviceController {

    @Autowired
    private DeviceRepository repository;

    private final TokenGenerator tokenGenerator = new TokenGenerator();


    @GetMapping("/device")
    public List<Device> getAllDevices() {
        log.info("getAllDevices");
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return repository.findDevicesByCustomerId(loggedCustomer.getId());
    }

    @GetMapping("/device/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable(value = "id") long deviceId)
            throws ResourceNotFoundException {
        log.info("getDeviceById");
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        return ResponseEntity.ok().body(device);
    }

    @PutMapping("/device/{id}/config")
    public ResponseEntity<ClientMessage> updateDeviceConfig(
            @PathVariable(value = "id") long deviceId,
            @RequestParam long updateFrequency,
            @RequestParam boolean enabled)
            throws ResourceNotFoundException {
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        DeviceConfig deviceConfig = device.getConfig();
        deviceConfig.setEnabled(enabled);
        deviceConfig.setUpdate_frequency(updateFrequency);
        repository.save(device);
        ClientMessage clientMessage = new ClientMessage("Device configuration updated");
        return ResponseEntity.ok(clientMessage);
    }

    @GetMapping("/device/{id}/generatetoken")
    public ResponseEntity<ClientMessage> generateNewToken(@PathVariable(value = "id") long deviceId)
            throws ResourceNotFoundException {
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        DeviceConfig deviceConfig = device.getConfig();
        deviceConfig.setToken(tokenGenerator.nextToken());
        repository.save(device);
        ClientMessage clientMessage = new ClientMessage("New token generated for device id: "+ deviceId);
        return ResponseEntity.ok(clientMessage);
    }
}
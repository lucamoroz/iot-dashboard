package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.ClientMessage;
import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.model.DeviceConfig;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import it.unipd.webapp.devicemanagement.model.Customer;

@RestController
@Slf4j
@RequestMapping("/api/v1")
public class DeviceController {

    @Autowired
    private DeviceRepository repository;

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
}
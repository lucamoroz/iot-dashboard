package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.*;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.security.TokenGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

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

    @PostMapping("/device")
    public ResponseEntity<ClientMessage> addDevice(
            @RequestParam long productId,
            @RequestParam long updateFrequency,
            @RequestParam boolean enabled,
            @RequestParam float latitude,
            @RequestParam float longitude) {

        DeviceConfig deviceConfig = new DeviceConfig();
        deviceConfig.setToken(tokenGenerator.nextToken());
        deviceConfig.setUpdate_frequency(updateFrequency);
        deviceConfig.setEnabled(enabled);
        deviceConfig.setLatitude(latitude);
        deviceConfig.setLongitude(longitude);

        DeviceStatus deviceStatus = new DeviceStatus();
        deviceStatus.setBattery((byte)100);
        deviceStatus.setVersion("x.y.z");
        deviceStatus.setLast_update(new Date());

        Device device = new Device();
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        device.setCustomer(loggedCustomer);
        device.setConfig(deviceConfig);
        // TODO: add setProduct when ProductRepository will be merged

        repository.save(device);
        ClientMessage clientMessage = new ClientMessage("New device added");
        return ResponseEntity.ok(clientMessage);
    }

    @DeleteMapping("/device/{id}")
    public ResponseEntity<ClientMessage> deleteDeviceById(@PathVariable(value = "id") long deviceId)
            throws ResourceNotFoundException {
        log.info("deleteDeviceById");
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        repository.delete(device);
        // TODO: remove references of this device in other tables
        ClientMessage clientMessage = new ClientMessage("Deleted device id: "+ deviceId);
        return ResponseEntity.ok(clientMessage);
    }
}
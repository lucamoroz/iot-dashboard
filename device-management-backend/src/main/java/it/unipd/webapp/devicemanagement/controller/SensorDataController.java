package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ForbiddenException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.*;
import it.unipd.webapp.devicemanagement.service.SensorDataService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;

import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.security.DeviceAuthenticationToken;

@RestController
@Slf4j
public class SensorDataController {

    @Autowired
    private DeviceRepository deviceRepo;

    @Autowired
    private SensorDataService sensorDataService;


    @Secured("ROLE_DEVICE")
    @PostMapping("/device/sensordata")
    public ResponseEntity<ClientMessage> addSensorData(@RequestBody SensorData[] sensorDatas) throws ForbiddenException {
        
        //Gets the authentified Device from SecurityContextHolder
        DeviceAuthenticationToken deviceAuth = (DeviceAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Device device = deviceAuth.getDevice();

        sensorDataService.addSensorData(device, Arrays.asList(sensorDatas));

        var message = new ClientMessage(String.format("added %d measurements", sensorDatas.length));
        return ResponseEntity.ok().body(message);
    }

    @GetMapping("/devices/{id}/data")
    public ResponseEntity<Map<Date, Map<String, Float>>> getDeviceData(
        @PathVariable(value = "id") Long deviceId,
        @RequestParam(value = "limit", defaultValue = "50") int limit,
        @RequestParam(value = "lastLast", defaultValue = "true") boolean lastLast) throws ResourceNotFoundException {

        Long customerId = getLoggedCustomerId();

        //Checks if there is a device with id=deviceId of a the current Customer with id=customerId
        deviceRepo.findCustomerDeviceById(customerId, deviceId).orElseThrow(
            () -> new ResourceNotFoundException(String.format("Device with id=%d of current user not found", deviceId))
        );

        Map<Date, Map<String, Float>> deviceDatas = sensorDataService.getSensorData(deviceId, limit, lastLast);

        return ResponseEntity.ok().body(deviceDatas);
    }

    public Long getLoggedCustomerId() {
        Customer customer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return customer.getId();
    }

}
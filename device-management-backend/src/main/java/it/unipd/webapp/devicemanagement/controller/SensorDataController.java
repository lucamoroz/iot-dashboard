package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ForbiddenException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.Customer;
import it.unipd.webapp.devicemanagement.model.CustomerPlan;
import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.model.DeviceStatus;
import it.unipd.webapp.devicemanagement.model.SensorData;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.stream.Collectors;

import it.unipd.webapp.devicemanagement.repository.CustomerRepository;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.repository.SensorDataRepository;
import it.unipd.webapp.devicemanagement.security.DeviceAuthenticationToken;

@RestController
@Slf4j
public class SensorDataController {

    @Autowired
    private DeviceRepository deviceRepo;
    
    @Autowired
    private SensorDataRepository sensorDataRepo;

    @Autowired
    private CustomerRepository customerRepo;


    @Secured("ROLE_DEVICE")
    @PostMapping("/device/sensordata")
    public ResponseEntity<List<SensorData>> addSensorData(@RequestBody SensorData[] sensorDatas) throws ResourceNotFoundException, ForbiddenException {
        
        //Gets the authentified Device from SecurityContextHolder
        DeviceAuthenticationToken deviceAuth = (DeviceAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Device device = deviceAuth.getDevice();

        //Checks that the Device is enabled
        if (!device.getConfig().isEnabled()) {
            throw new ForbiddenException(String.format("Device with id=%d is disabled", device.getId()));
        }

        //Checks if the Customer has calls available
        Customer customer = device.getCustomer();
        CustomerPlan plan = customer.getPlan();
        Long currentCalls = customer.getCallsCount();
        int maxCalls = (plan == CustomerPlan.FREE) ? 1000 : 10000;
        if (currentCalls >= maxCalls) {
            throw new ForbiddenException("Run out of calls");
        }

        //Increments the Customer calls count by 1
        customerRepo.incrementCallsCount(device.getCustomer().getId());
        
        List<SensorData> sensorDataOutputs = new ArrayList<>();
        Date timestamp = new Date();
        //Saves in the db every data received in the JSON
        sensorDataOutputs = Arrays.stream(sensorDatas).map(sensorData -> {
            //Sets current timestamp and device corresponding to the token
            sensorData.setTimestamp(timestamp);
            sensorData.setDevice(device);
            return sensorData;
        }).collect(Collectors.toList());
        //Saves all the sensor data to the DB
        sensorDataRepo.saveAll(sensorDataOutputs);

        //Update last update timestamp
        device.getDeviceStatus().setLast_update(timestamp);
        deviceRepo.save(device);

        return ResponseEntity.ok().body(sensorDataOutputs);
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
         
        //Returns the list of SensorData, thow exception if the id is not found (this is already checked before)
        List<SensorData> sensorDatas = sensorDataRepo.getDeviceDataByDeviceId(deviceId, limit).orElseThrow(
            () -> new ResourceNotFoundException(String.format("Device with id=%d not found", deviceId))
        );

        //Creates a TreeMap depending on the order we want
        SortedMap<Date, Map<String, Float>> deviceDatas;
        deviceDatas = lastLast ? new TreeMap<>() : new TreeMap<>(Collections.reverseOrder());

        for (SensorData sensorData : sensorDatas) {
            Date timestamp = sensorData.getTimestamp();

            //Checks if the current timestamp is not in the Map yet
            if (!deviceDatas.containsKey(timestamp)) {
                deviceDatas.put(timestamp, new HashMap<String, Float>());
            }

            //Gets the Map corresponding to the required timestamp
            Map<String, Float> deviceData = deviceDatas.get(timestamp);

            //Puts new data in the corresponding Map
            String sensorType = sensorData.getDataType().getTypeName();
            Float sensorValue = sensorData.getValue();
            deviceData.put(sensorType, sensorValue);
        }

        return ResponseEntity.ok().body(deviceDatas);
    }

    public Long getLoggedCustomerId() {
        Customer customer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return customer.getId();
    }

}
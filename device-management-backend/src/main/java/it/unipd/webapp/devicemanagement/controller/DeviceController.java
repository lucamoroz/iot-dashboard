package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.*;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.repository.ProductRepository;
import it.unipd.webapp.devicemanagement.repository.SensorDataRepository;
import it.unipd.webapp.devicemanagement.security.DeviceAuthenticationToken;
import it.unipd.webapp.devicemanagement.service.DeviceService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@Slf4j
public class DeviceController {

    @Autowired
    private DeviceRepository repository;

    @Autowired
    private SensorDataRepository sensorDataRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private DeviceService deviceService;

    /**
     * Gets all devices owned by the logged user.
     * @param includeLastData Include last data received from each device if true
     * @param groupId Filter by group if this parameter is set
     * @return List of devices with data optionally
     * @throws ResourceNotFoundException
     */
    @GetMapping("/devices")
    public List<HashMap<String, Object>> getAllDevices(
            @RequestParam(defaultValue = "false") boolean includeLastData,
            @RequestParam(required = false) Long groupId
    )
            throws ResourceNotFoundException{
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<List<Device>> devices;
        if (groupId != null){
            devices = repository.findDevicesByCustomerAndGroup(loggedCustomer.getId(), groupId);
        } else {
            devices = repository.findDevicesByCustomer(loggedCustomer.getId());
        }

        if (devices.isEmpty() || devices.get().isEmpty()) {
            throw new ResourceNotFoundException("No devices found");
        }

        List<HashMap<String, Object>> outputs = new ArrayList<>();
        for (Device device : devices.get()) {
            HashMap<String, Object> output = new HashMap<>();
            output.put("device", device);

            if (includeLastData) {
                Map<String, Float> deviceData = getLastDeviceData(device);
                output.put("data", deviceData);
            }

            outputs.add(output);
        }
        return outputs;
    }

    /**
     * Get the last data received from a device
     * @param device The device whose last data we are looking for
     * @return Last data mapped as key->data
     */
    private Map<String, Float> getLastDeviceData(Device device) {
        Optional<List<SensorData>> sensorDataOpts = sensorDataRepo.getLastDeviceDataByDeviceId(device.getId());
        Map<String, Float> deviceData = new HashMap<>();
        if (sensorDataOpts.isPresent()) {
            for (SensorData data : sensorDataOpts.get()) {
                String sensorType = data.getDataType().getTypeName();
                Float sensorValue = data.getValue();
                deviceData.put(sensorType, sensorValue);
            }
        }
        return deviceData;
    }

    /**
     * Update device status with data received from a device
     * @param newDeviceStatus New device status containing battery and version
     * @return a ResponseEntity message
     * @throws ResourceNotFoundException In case no device is associated with the recived token
     */
    @Secured("ROLE_DEVICE")
    @PostMapping("/device/status")
    public ResponseEntity<ClientMessage> updateDeviceStatus(
            @RequestBody DeviceStatus newDeviceStatus
    ) throws ResourceNotFoundException {
        log.debug(newDeviceStatus.getVersion());
        DeviceAuthenticationToken deviceAuth = (DeviceAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        Device device = deviceAuth.getDevice();

        DeviceStatus deviceStatus = device.getDeviceStatus();
        deviceStatus.setVersion(newDeviceStatus.getVersion());
        deviceStatus.setBattery(newDeviceStatus.getBattery());
        repository.save(device);

        ClientMessage clientMessage = new ClientMessage("Device status updated");
        return ResponseEntity.ok(clientMessage);
    }

    /**
     * Get a single device with status and config
     * @param deviceId Id of the device
     * @return Response with device info
     * @throws ResourceNotFoundException In case no device with specified id is owned by the user
     */
    @GetMapping("/devices/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable(value = "id") long deviceId)
            throws ResourceNotFoundException {
        log.info("getDeviceById");
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        return ResponseEntity.ok().body(device);
    }

    /**
     * Update a device's config
     * @param deviceId Id of the device we want to config
     * @param updateFrequency New update frequency
     * @param enabled Enable/disable the device
     * @return A ResponseEntity with message
     * @throws ResourceNotFoundException In case no device with specified id is owned by the user
     */
    @PutMapping("/devices/{id}/config")
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

    /**
     * Generate a new token for a device
     * @param deviceId Id of the device
     * @return A ResponseEntity with message
     * @throws ResourceNotFoundException In case no device with specified id is owned by the user
     */
    @PutMapping("/devices/{id}/generatetoken")
    public ResponseEntity<ClientMessage> generateNewToken(@PathVariable(value = "id") long deviceId)
            throws ResourceNotFoundException {
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        deviceService.generateNewToken(device);
        ClientMessage clientMessage = new ClientMessage("New token generated for device id: "+ deviceId);
        return ResponseEntity.ok(clientMessage);
    }
}
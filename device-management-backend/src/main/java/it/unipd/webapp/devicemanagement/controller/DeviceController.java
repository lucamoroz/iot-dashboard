package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.model.*;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.repository.ProductRepository;
import it.unipd.webapp.devicemanagement.repository.SensorDataRepository;
import it.unipd.webapp.devicemanagement.security.DeviceAuthenticationToken;
import it.unipd.webapp.devicemanagement.security.TokenGenerator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.BadCredentialsException;
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

    private final TokenGenerator tokenGenerator = new TokenGenerator();


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

    @Secured("ROLE_DEVICE")
    @PostMapping("/device/status")
    public ResponseEntity<ClientMessage> updateDeviceStatus(
            @RequestParam byte battery,
            @RequestParam String version
    ) throws ResourceNotFoundException {
        log.debug("update status");
        DeviceAuthenticationToken deviceAuth = (DeviceAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        String token = deviceAuth.getCredentials().toString();

        Device device = repository.findDeviceByToken(token).orElseThrow(
                () -> new BadCredentialsException(String.format("Device with token %s not found!", token))
        );

        DeviceStatus deviceStatus = device.getDeviceStatus();
        deviceStatus.setBattery(battery);
        deviceStatus.setVersion(version);
        repository.save(device);

        ClientMessage clientMessage = new ClientMessage("Device status updated");
        return ResponseEntity.ok(clientMessage);
    }

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

    @GetMapping("/devices/{id}")
    public ResponseEntity<Device> getDeviceById(@PathVariable(value = "id") long deviceId)
            throws ResourceNotFoundException {
        log.info("getDeviceById");
        Customer loggedCustomer = (Customer) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Device device = repository.findCustomerDeviceById(loggedCustomer.getId(), deviceId).
                orElseThrow(() -> new ResourceNotFoundException("user's device not found for id: " + deviceId));
        return ResponseEntity.ok().body(device);
    }

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

    @GetMapping("/devices/{id}/generatetoken")
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

    @PostMapping("/devices")
    public ResponseEntity<ClientMessage> addDevice(
            @RequestParam long productId,
            @RequestParam long updateFrequency,
            @RequestParam boolean enabled,
            @RequestParam float latitude,
            @RequestParam float longitude
    )throws ResourceNotFoundException {
        log.debug("addDevice");

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
        device.setDeviceStatus(deviceStatus);

        Product product = productRepo.getInfo(productId).orElseThrow(() -> new ResourceNotFoundException("Product "+productId+" doesn't exist"));
        device.setProduct(product);

        repository.save(device);
        ClientMessage clientMessage = new ClientMessage("New device added");
        return ResponseEntity.ok(clientMessage);
    }
}
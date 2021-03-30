package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.model.SensorData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.SortedMap;
import java.util.TreeMap;

import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.repository.SensorDataRepository;

@RestController
@Slf4j
@RequestMapping("/api/v1")
public class SensorDataController {

    @Autowired
    private DeviceRepository deviceRepo;
    
    @Autowired
    private SensorDataRepository sensorDataRepo;


    @PostMapping("/addsensordata")
    public ResponseEntity<List<SensorData>> addSensorData(@RequestHeader("Authorization") String token, @RequestBody SensorData[] sensorDatas) {
        //Parses the token
        token = token.split(" ")[1];

        //Finds the device with the token above
        Optional<Device> deviceOpt = deviceRepo.findByToken(token);
        if (deviceOpt.isEmpty()) {
            //Error: token not found //TODO
            log.info("Token not found");
            return ResponseEntity.notFound().build();
        }

        Device device = deviceOpt.get();
        if (!device.getConfig().isEnabled()) {
            //Error: device not enabled //TODO
            log.info("Device not enabled");
            return ResponseEntity.notFound().build();
        }
        
        List<SensorData> sensorDataOutputs = new ArrayList<>();
        Date timestamp = new Date();
        //Saves in the db every data received in the JSON
        for (SensorData sensorData : sensorDatas) {
            //Sets current timestamp and device corresponding to the token
            sensorData.setTimestamp(timestamp);
            sensorData.setDevice(device);
            //Saves the sensor data to the DB
            SensorData sensorDataOutput = sensorDataRepo.save(sensorData);
            sensorDataOutputs.add(sensorDataOutput);
        }

        return ResponseEntity.ok().body(sensorDataOutputs);
    }

    @GetMapping("/devices/{id}/data")
    public ResponseEntity<Map<Date, Map<String, Float>>> getDeviceData(
        @PathVariable(value = "id") Long deviceId,
        @RequestParam(value = "limit", defaultValue = "50") int limit,
        @RequestParam(value = "lastLast", defaultValue = "true") boolean lastLast) {
         
        Optional<List<SensorData>> sensorDataOpts = sensorDataRepo.getDeviceDataByDeviceId(deviceId, limit);
        if (sensorDataOpts.isEmpty()) {
            //Error: device not found //TODO
            log.info("Device not found");
            return ResponseEntity.notFound().build();
        }

        //TODO
        //checks if the device is of the current user

        //Creates a TreeMap depending on the order we want
        SortedMap<Date, Map<String, Float>> deviceDatas;
        deviceDatas = lastLast ? new TreeMap<>() : new TreeMap<>(Collections.reverseOrder());

        List<SensorData> sensorDatas = sensorDataOpts.get();
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
}
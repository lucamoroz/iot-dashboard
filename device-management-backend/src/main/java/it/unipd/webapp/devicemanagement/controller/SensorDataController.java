package it.unipd.webapp.devicemanagement.controller;

import it.unipd.webapp.devicemanagement.model.Device;
import it.unipd.webapp.devicemanagement.model.SensorData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
            //Error: token not found
            //TODO
            log.info("Token not found");
            return ResponseEntity.notFound().build();
        }

        Device device = deviceOpt.get();
        if (!device.getConfig().isEnabled()) {
            //Error: device not enabled
            //TODO
            log.info("Device not enabled");
            return ResponseEntity.notFound().build();
        }
        
        List<SensorData> sensorDataOutputs = new ArrayList<>();
        //Saves in the db every data received in the JSON
        for (SensorData sensorData : sensorDatas) {
            //Sets current timestamp and device corresponding to the token
            sensorData.setTimestamp(new Date());
            sensorData.setDevice(device);
            //Saves the sensor data to the DB
            SensorData sensorDataOutput = sensorDataRepo.save(sensorData);
            sensorDataOutputs.add(sensorDataOutput);
        }

        return ResponseEntity.ok().body(sensorDataOutputs);
    }
}
package it.unipd.webapp.devicemanagement.service;

import it.unipd.webapp.devicemanagement.exception.ForbiddenException;
import it.unipd.webapp.devicemanagement.exception.ResourceNotFoundException;
import it.unipd.webapp.devicemanagement.exception.ErrorCode;
import it.unipd.webapp.devicemanagement.model.*;
import it.unipd.webapp.devicemanagement.repository.DeviceRepository;
import it.unipd.webapp.devicemanagement.repository.SensorDataRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class SensorDataService {

    @Autowired
    private DeviceRepository deviceRepo;

    @Autowired
    private SensorDataRepository sensorDataRepo;

    @Autowired
    private CustomerService customerService;

    /**
     * Add new device data to a given device.
     * This method increases the number of calls performed by the customer owning the device.
     * @param device device that collected the data
     * @param data data to be added
     * @throws ForbiddenException if the Customer owning the device has reached the maximum calls or if the device is
     *  disabled.
     */
    @Transactional
    public void addSensorData(Device device, List<SensorData> data) throws ForbiddenException {
        //Checks that the Device is enabled
        if (!device.getConfig().isEnabled()) {
            throw new ForbiddenException("Device is disabled", ErrorCode.ESDA1);
        }

        customerService.incrementCallsCount(device.getCustomer());

        Date timestamp = new Date();
        //Saves in the db every data received in the JSON
        final List<SensorData> filledData = data.stream().map(sensorData -> {
            //Sets current timestamp and device corresponding to the token
            sensorData.setTimestamp(timestamp);
            sensorData.setDevice(device);
            return sensorData;
        }).collect(Collectors.toList());

        sensorDataRepo.saveAll(filledData);

        //Update last update timestamp
        device.getDeviceStatus().setLast_update(timestamp);
        deviceRepo.save(device);
    }

    public Map<Date, Map<String, Float>> getSensorData(long deviceId, int limit, boolean reversed) throws ResourceNotFoundException {
        List<SensorData> sensorDatas = sensorDataRepo.getDeviceDataByDeviceId(deviceId, limit)
                .orElseThrow(() -> new ResourceNotFoundException("device not found"));

        //Creates a TreeMap depending on the order we want
        SortedMap<Date, Map<String, Float>> deviceDatas;
        deviceDatas = reversed ? new TreeMap<>() : new TreeMap<>(Collections.reverseOrder());

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
        return deviceDatas;
    }
}

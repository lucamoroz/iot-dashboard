package it.unipd.webapp.devicemanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import it.unipd.webapp.devicemanagement.model.SensorData;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    
    @Query(value = "SELECT id, value, timestamp, device_id, data_type_id FROM sensor_data WHERE device_id = :deviceId ORDER BY timestamp DESC LIMIT :limit", nativeQuery = true)
    public Optional<List<SensorData>> getDeviceDataByDeviceId(Long deviceId, int limit);

    @Query(value = "SELECT * FROM sensor_data AS sd WHERE sd.device_id = :deviceId AND sd.timestamp = (SELECT timestamp FROM sensor_data AS sd WHERE sd.device_id = :deviceId GROUP BY timestamp ORDER BY timestamp DESC LIMIT 1)", nativeQuery = true)
    public Optional<List<SensorData>> getLastDeviceDataByDeviceId(Long deviceId);

}









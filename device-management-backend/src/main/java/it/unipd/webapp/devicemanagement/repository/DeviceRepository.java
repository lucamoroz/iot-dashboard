package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    @Query("SELECT d FROM device d WHERE d.customer_id = ?1")
    List<Device> findDevicesByCustomerId(long customerId);
}

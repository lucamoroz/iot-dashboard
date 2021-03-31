package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    @Query("SELECT d FROM Device d WHERE d.customer.id = ?1")
    List<Device> findDevicesByCustomerId(long customerId);

    @Query("SELECT d FROM Device d WHERE d.customer.id = ?1 AND d.id = ?2")
    Optional<Device> findCustomerDeviceById(long customerId, long deviceId);
}

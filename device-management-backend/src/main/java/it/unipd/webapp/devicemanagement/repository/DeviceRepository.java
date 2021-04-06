package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.Device;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    @Query(value="SELECT * FROM device WHERE token = :token", nativeQuery = true)
    public Optional<Device> findDeviceByToken(String token);

    @Query(value="SELECT * FROM device WHERE customer_id = :customerId", nativeQuery = true)
    public Optional<List<Device>> findDevicesByCustomer(Long customerId);

    @Query(value = "SELECT d.id, d.enabled, d.latitude, d.longitude, d.token, d.update_frequency, " +
            "d.battery, d.last_update, d.version, d.customer_id, d.product_id FROM device as d " +
            "LEFT JOIN customer_groups_devices AS cgd ON d.id = cgd.device_id " +
            "WHERE d.customer_id = :customerId AND cgd.customer_group_id = :groupId", nativeQuery = true)
    public Optional<List<Device>> findDevicesByCustomerAndGroup(Long customerId, Long groupId);

    @Query("SELECT d FROM Device d WHERE d.customer.id = ?1 AND d.id = ?2")
    Optional<Device> findCustomerDeviceById(long customerId, long deviceId);
}
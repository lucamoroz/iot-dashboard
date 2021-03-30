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
    public Optional<Device> findByToken(String token);

    @Query(value="SELECT * FROM device WHERE customer_id = :customerId", nativeQuery = true)
    public Optional<List<Device>> findDevicesByCustomer(Long customerId);

}
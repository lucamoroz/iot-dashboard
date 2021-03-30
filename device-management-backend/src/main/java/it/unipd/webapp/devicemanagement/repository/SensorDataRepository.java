package it.unipd.webapp.devicemanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.unipd.webapp.devicemanagement.model.SensorData;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    
}









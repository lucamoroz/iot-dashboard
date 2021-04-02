package it.unipd.webapp.devicemanagement.repository;

import it.unipd.webapp.devicemanagement.model.DataType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DataTypeRepository extends JpaRepository<DataType, Integer> {

}
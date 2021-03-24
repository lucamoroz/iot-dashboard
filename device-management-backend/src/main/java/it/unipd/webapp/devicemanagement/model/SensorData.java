package it.unipd.webapp.devicemanagement.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

// ref: https://www.baeldung.com/hibernate-inheritance#mappedsuperclass
@Data
@MappedSuperclass
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "timestamp", nullable = false)
    private Date timestamp;
}

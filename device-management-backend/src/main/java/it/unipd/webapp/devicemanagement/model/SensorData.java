package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "value", nullable = false)
    private float value;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "timestamp", nullable = false)
    private Date timestamp;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", referencedColumnName = "id")
    @JsonIgnore
    private Device device;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "data_type_id", referencedColumnName = "id")
    @JsonProperty(access = Access.WRITE_ONLY)
    private DataType dataType;

}

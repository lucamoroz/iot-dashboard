package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Table(name = "thp_sensor_data")
public class THPSensorData extends SensorData {

    @Column(name = "temperature", nullable = false)
    private float temperature;

    @Column(name = "humidity", nullable = false)
    private float humidity;

    @Column(name = "pressure", nullable = false)
    private int pressure;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", referencedColumnName = "id")
    @JsonIgnore
    private Device device;
}

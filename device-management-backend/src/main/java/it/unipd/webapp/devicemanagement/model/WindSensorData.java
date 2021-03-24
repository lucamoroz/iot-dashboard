package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@Table(name = "wind_sensor_data")
public class WindSensorData extends SensorData {

    @Column(name = "speed")
    private float speed;

    @Column(name = "bearing")
    private int bearing;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "device_id", referencedColumnName = "id")
    @JsonIgnore
    private Device device;

}

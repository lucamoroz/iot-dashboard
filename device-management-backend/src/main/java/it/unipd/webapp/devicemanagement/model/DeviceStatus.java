package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "device_status")
public class DeviceStatus implements Serializable {

    @Id
    @Column(name = "device_id")
    private long device_id;

    // range [0,100] ? (e.g. 50 -> 50% battery)
    @Column(name = "battery_percentage", nullable = false)
    private byte battery_percentage;


    @OneToOne(optional = false)
    @JoinColumn(name = "device_id", referencedColumnName = "id")
    @JsonIgnore
    private Device device;
}

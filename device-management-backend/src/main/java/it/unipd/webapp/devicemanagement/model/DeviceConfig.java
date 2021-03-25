package it.unipd.webapp.devicemanagement.model;

import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Embeddable
public class DeviceConfig implements Serializable {

    @Column(name = "update_frequency", nullable = false)
    private long update_frequency;

    @Column(name = "enabled", nullable = false)
    private boolean enabled;

    @Column(name = "token", nullable = true)
    private String token;

    @Column(name = "latitude", nullable = true)
    private float latitude;

    @Column(name = "longitude", nullable = true)
    private float longitude;

}

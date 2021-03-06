package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Embeddable
public class DeviceStatus implements Serializable {

    // range [0,100] ? (e.g. 50 -> 50% battery)
    @Column(name = "battery", nullable = true)
    private Byte battery;

    // Software version e.g. 1.0.2 (format X.Y.Z: major.minor.bugfix)
    @Column(name = "version", length = 10, nullable = false)
    private String version;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "last_update", nullable = true)
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Date last_update;
}

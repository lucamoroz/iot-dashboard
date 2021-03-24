package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "device_config")
public class DeviceConfig implements Serializable {

    @Id
    @Column(name = "device_id")
    private long device_id;

    @Column(name = "update_frequency", nullable = false)
    private long update_frequency;

    @Column(name = "is_enabled", nullable = false)
    private boolean is_enabled = true;

    // Software version e.g. 1.0.2 (format X.Y.Z: major.minor.bugfix)
    @Column(name = "version", length = 10, nullable = false)
    private String version;

    @Id
    @OneToOne(optional = false)
    @JoinColumn(name = "device_id", referencedColumnName = "id")
    @JsonIgnore
    private Device device;
}

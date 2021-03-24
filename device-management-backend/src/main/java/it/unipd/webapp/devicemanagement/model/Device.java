package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "device")
public class Device {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private DeviceType type;

    @Column(name = "label", length = 64)
    private String label;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", referencedColumnName = "id")
    @JsonIgnore
    private Customer customer;

    @OneToOne(mappedBy = "device")
    private DeviceStatus status;

    @OneToOne(mappedBy = "device")
    private DeviceConfig config;

}

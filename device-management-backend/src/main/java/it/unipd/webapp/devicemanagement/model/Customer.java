package it.unipd.webapp.devicemanagement.model;


import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@Data
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotBlank(message = "Email is mandatory")
    @Column(name = "email", length = 127, nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password is mandatory")
    @Column(name = "password", length = 255, nullable = false)
    private String password;

    @NotBlank(message = "Username is mandatory")
    @Column(name = "username", length = 127, nullable = false)
    private String username;

    @Column(name = "calls_count", nullable = false)
    private long callsCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan", nullable = false)
    private CustomerPlan plan;


    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Device> devices;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<CustomerGroup> groups;

    @OneToMany(mappedBy = "customer", fetch = FetchType.LAZY)
    private List<Order> orders;
}

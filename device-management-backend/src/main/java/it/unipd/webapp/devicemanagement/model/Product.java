package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Data
@Entity(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "image", nullable = true)
    private Byte[] image;

    @Column(name = "price", nullable = false)
    private float price;

    @Column(name = "description", nullable = true, length = 1024)
    private String description;


    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Device> devices;

    @ManyToMany
    @JoinTable(
            name = "products_data_types",
            joinColumns = @JoinColumn(name = "product_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "data_type_id", referencedColumnName = "id")
    )
    @JsonIgnore
    private List<DataType> dataTypes;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private List<OrderProduct> orderProducts;
}

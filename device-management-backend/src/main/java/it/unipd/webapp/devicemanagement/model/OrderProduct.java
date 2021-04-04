package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity(name = "orders_products")
public class OrderProduct implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "quantity", nullable = false)
    private int quantity;


    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    @JsonIgnore
    private OrderDetail order;

    @ManyToOne(optional = false, fetch = FetchType.EAGER) // With lazy crashes
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    //@JsonIgnore
    private Product product;

}

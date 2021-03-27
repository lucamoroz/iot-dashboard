package it.unipd.webapp.devicemanagement.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity(name = "data_type")
public class DataType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "type_name", unique = true, nullable = false)
    private String typeName;

}

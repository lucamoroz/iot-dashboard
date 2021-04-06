package it.unipd.webapp.devicemanagement.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * This class is not related to any entity in the database! It's a wrapper class for a json response
 */
@Data
public class CartDetail {

    // When an order does not exists, we would like to avoid to send a nullable value in the json.
    // So when null, order is not shown in the json
    @JsonInclude(JsonInclude.Include.NON_NULL)
    OrderDetail order;

    // When no products are available, an empty list should be returned but it mustn't be null.
    @NotNull
    List<OrderProduct> orderProducts;
}

package it.unipd.webapp.devicemanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Class used to send a generic message to the client.
 */

@Data
@AllArgsConstructor
public class ClientMessage {
    private String message;
}

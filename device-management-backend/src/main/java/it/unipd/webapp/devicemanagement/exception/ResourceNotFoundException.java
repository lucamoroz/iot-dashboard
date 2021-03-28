package it.unipd.webapp.devicemanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends Exception {
    private static final long serialVersionUID = 1;

    public ResourceNotFoundException(String message){
        super(message);
    }
}
package it.unipd.webapp.devicemanagement.exception;

public class ResourceNotFoundException extends Exception {
    private static final long serialVersionUID = 1;

    public ResourceNotFoundException(String message){
        super(message);
    }
}
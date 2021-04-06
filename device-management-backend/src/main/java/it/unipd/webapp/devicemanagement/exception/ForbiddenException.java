package it.unipd.webapp.devicemanagement.exception;

public class ForbiddenException extends Exception {
    private static final long serialVersionUID = 2;

    public ForbiddenException(String message){
        super(message);
    }
}
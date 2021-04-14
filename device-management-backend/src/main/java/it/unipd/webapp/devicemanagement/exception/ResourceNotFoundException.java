package it.unipd.webapp.devicemanagement.exception;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String message, ErrorCode code) {
        super(message, code);
    }

    public ResourceNotFoundException(String message) {
        super(message, ErrorCode.NONE);
    }
}
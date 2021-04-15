package it.unipd.webapp.devicemanagement.exception;

import org.springframework.http.HttpStatus;

public class ResourceNotFoundException extends BaseException {

    public ResourceNotFoundException(String message, ErrorCode code) {
        super(message, code);
    }

    public ResourceNotFoundException(String message) {
        super(message, ErrorCode.NONE);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.NOT_FOUND;
    }
}
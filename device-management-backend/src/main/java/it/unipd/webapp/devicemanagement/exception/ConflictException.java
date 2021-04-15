package it.unipd.webapp.devicemanagement.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends BaseException {
    public ConflictException(String message, ErrorCode code) {
        super(message, code);
    }

    public ConflictException(String message) {
        super(message, ErrorCode.NONE);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.CONFLICT;
    }
}

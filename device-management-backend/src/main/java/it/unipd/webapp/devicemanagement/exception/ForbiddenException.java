package it.unipd.webapp.devicemanagement.exception;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends BaseException {
    public ForbiddenException(String message, ErrorCode code) {
        super(message, code);
    }

    public ForbiddenException(String message) {
        super(message, ErrorCode.NONE);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.FORBIDDEN;
    }
}

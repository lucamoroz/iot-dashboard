package it.unipd.webapp.devicemanagement.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends BaseException {
    public BadRequestException(String message, ErrorCode code) {
        super(message, code);
    }

    public BadRequestException(String message) {
        super(message, ErrorCode.NONE);
    }

    @Override
    public HttpStatus getHttpStatus() {
        return HttpStatus.BAD_REQUEST;
    }
}

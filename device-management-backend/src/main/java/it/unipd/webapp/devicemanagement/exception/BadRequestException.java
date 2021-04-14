package it.unipd.webapp.devicemanagement.exception;

public class BadRequestException extends BaseException {
    public BadRequestException(String message, ErrorCode code) {
        super(message, code);
    }

    public BadRequestException(String message) {
        super(message, ErrorCode.NONE);
    }
}

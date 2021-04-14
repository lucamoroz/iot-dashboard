package it.unipd.webapp.devicemanagement.exception;

public class ConflictException extends BaseException {
    public ConflictException(String message, ErrorCode code) {
        super(message, code);
    }

    public ConflictException(String message) {
        super(message, ErrorCode.NONE);
    }
}

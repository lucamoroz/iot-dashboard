package it.unipd.webapp.devicemanagement.exception;

public class ForbiddenException extends BaseException {
    public ForbiddenException(String message, ErrorCode code) {
        super(message, code);
    }

    public ForbiddenException(String message) {
        super(message, ErrorCode.NONE);
    }
}

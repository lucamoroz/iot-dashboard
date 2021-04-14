package it.unipd.webapp.devicemanagement.exception;

import lombok.Getter;

/**
 * Exception that adds an ErrorCode identifying the cause.
 */
@Getter
public class BaseException extends Exception {

    private final ErrorCode errorCode;

    public BaseException(String message, ErrorCode code) {
        super(message);
        this.errorCode = code;
    }
}

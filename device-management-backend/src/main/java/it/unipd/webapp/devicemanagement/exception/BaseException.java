package it.unipd.webapp.devicemanagement.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Exception that adds an ErrorCode identifying the cause.
 */
@Getter
public abstract class BaseException extends Exception {

    private final ErrorCode errorCode;

    public BaseException(String message, ErrorCode code) {
        super(message);
        this.errorCode = code;
    }

    public abstract HttpStatus getHttpStatus();
}

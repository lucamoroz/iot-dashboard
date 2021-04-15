package it.unipd.webapp.devicemanagement.exception;

import lombok.extern.slf4j.Slf4j;
import org.postgresql.util.PSQLException;
import org.postgresql.util.ServerErrorMessage;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
@Slf4j
public class GlobalRestExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(PSQLException.class)
    public ResponseEntity<CustomErrorResponse> pgExceptionHandler(PSQLException ex, WebRequest request) {

        ServerErrorMessage error = ex.getServerErrorMessage();

        var errors = CustomErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .errorCode(ErrorCode.INTERNAL)
                .reason(error.getDetail())
                .description(error.getMessage()) // TODO remove this on "production" - we shouldn't expose internal errors
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();

        return new ResponseEntity<>(errors, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(value = {
            BadRequestException.class,
            ConflictException.class,
            ForbiddenException.class,
            ResourceNotFoundException.class
    })
    public ResponseEntity<CustomErrorResponse> badExceptionHandler(BaseException ex, WebRequest request) {
        var error = buildErrorResponse(ex);
        return new ResponseEntity<>(error, ex.getHttpStatus());
    }

    private CustomErrorResponse buildErrorResponse(BaseException ex) {
        return CustomErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .errorCode(ex.getErrorCode())
                .reason(ex.getHttpStatus().getReasonPhrase())
                .description(ex.getMessage())
                .status(ex.getHttpStatus().value())
                .build();
    }
}

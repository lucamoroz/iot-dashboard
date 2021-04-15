package it.unipd.webapp.devicemanagement.exception;

public enum ErrorCode {
    /** No error code, should never be used */
    NONE,
    /** Internal Server Error - reserved for unknown exceptions */
    INTERNAL,
    /** Customer Not Found */
    ECUS1,
    /** Customer with given username already exists */
    ECUS2,
    /** Customer with given email already exists */
    ECUS3,
    /** Customer exceeded the available number of API calls */
    ECUS4,
    /** Customer input doesn't contain email */
    ECUS5,
    /** Customer input doesn't contain username */
    ECUS6,
    /** Customer input doesn't contain password */
    ECUS7,
    /** Invalid login operation */
    ELOG1,
    /** Invalid device authentication */
    EAUT1,
    /** Invalid customer authentication */
    EAUT2,
    /** Access denied */
    EAUT3,
    /** Device is disabled */
    ESDA1,
    /** Device of current user not found */
    ESDA2,
}

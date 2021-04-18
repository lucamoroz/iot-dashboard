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
    /** Device of logged customer not found with specified id */
    EDEV1,
    /** Invalid product id */
    EDEV2,
    /** Device is disabled */
    ESDA1,
    /** Device of current user not found */
    ESDA2,
    /** The product specified does not exist **/
    EPRD1,
    /** The product specified does not belong in the cart **/
    EPRD2,
    /** A wrong quantity specified for the selected product in the cart **/
    EPRD3,
    /** A non-completed order (i.e. cart) is not found **/
    EORD1,
    /** The specified order does not exist (nor completed nor currently in the cart) **/
    EORD2,
    /** Customer does not own the specified order **/
    EORD3,
    /** A blank address is passed to the order **/
    EORD4,
    /** The user is trying to buy an already completed order **/
    EORD5,
    /** An user is trying to buy from an empty cart  **/
    EORD6,
}

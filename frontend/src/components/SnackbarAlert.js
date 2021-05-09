import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import MuiAlert from "@material-ui/lab/Alert";

export default function SnackbarAlert(props) {
    // True if the snackbar has to be rendered
    const open = props.open;
    const autoHideDuration = props.autoHideDuration;
    // Function to call at the end of autoHideDuration (e.g. set open to false)
    const onTimeout = props.onTimeout;
    const message = props.message;
    // can be error, info, success, warning
    const severity = props.severity;

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={(e, r) => r === "timeout" && onTimeout()}
        >
            <Alert severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    )
}

function Alert(props) {
    return <MuiAlert elevation={5} variant="filled" {...props} />;
}
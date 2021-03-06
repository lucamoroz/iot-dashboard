import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {withStyles} from '@material-ui/styles';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from '@material-ui/core/Chip';
import Divider from "@material-ui/core/Divider";
import SnackbarAlert from "../components/SnackbarAlert";


const styles = theme => ({
    paper: {
        margin: 10,
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            padding: theme.spacing(3),
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    chip: {
        marginTop: 25,
        margin: 5
    },
    button: {
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(1),
    },
    buttons: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

const axios = require('axios').default

/**
 * Dialog for creating a new group and assign it to the current device
 * @param props A handle in props.whenDone which is call when this dialog is closed
 * @returns {JSX.Element}
 */
function AddNewGroupDialog(props) {

    // state capturing wether the dialog box is open or not
    const [open, setOpen] = React.useState(false);

    // state capturing wether the dialog box is open or not
    const [newGroupName, setNewGroupName] = React.useState("");

    const [error, setError] = React.useState("");

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleCloseNotSave = () => {
        setOpen(false);
    }

    const handleClose = () => {
        if (newGroupName === "") {
            setError("Please insert a group name")
        } else {
            setOpen(false);
            props.whenDone(newGroupName)
        }
    }

    const handleChange = (event) => {
        setNewGroupName(event.target.value);
    }

    return (
        <div style={{display: "inline"}}>
            <Button variant="contained" color="secondary" onClick={handleClickOpen}>
                New +
            </Button>
            <Dialog
                open={open}
                onClose={handleCloseNotSave}
                aria-labelledby="add-new-group-dialog"
                aria-describedby="add-new-group-dialog-description"
            >
                <DialogTitle id="add-new-group-dialog">{"Add new group"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="add-new-group-dialog-description">
                        Type below a name for the new group
                    </DialogContentText>
                    <form>
                        <TextField
                            onChange={handleChange}
                            id="newgrouptext"
                            label="New group name"
                            placeholder="Name"
                            helperText={error}
                            margin="normal"
                            error={error}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        add
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

}

class DeviceConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshRate: "",
            deviceGroups: [],
            token: "",
            enabled: false,
            latitude: "",
            longitude: "",
            allGroups: [],
            snackMessage: "",
            snackSeverity: "success",
            error: {
                refreshRate: "",
                latitude: "",
                longitude: ""
            }
        }

        this.handleRemoveGroup = this.handleRemoveGroup.bind(this);
        this.handleRefreshRate = this.handleRefreshRate.bind(this);
        this.handleOnOff = this.handleOnOff.bind(this);
        this.handleToken = this.handleToken.bind(this);
        this.handleLatitude = this.handleLatitude.bind(this);
        this.handleLongitude = this.handleLongitude.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    componentDidMount() {

        axios.get('devices/'+this.props.match.params.id)
        .then((resp) => {
            // Copies the groups name from the response
            let groups = [...resp.data.groups];
            this.setState({
                refreshRate: resp.data.device.config.update_frequency,
                deviceGroups: groups,
                token: resp.data.device.config.token,
                enabled: resp.data.device.config.enabled,
                latitude: resp.data.device.config.latitude,
                longitude: resp.data.device.config.longitude
            })
            axios.get('groups/')
            .then((resp2) => {
                // saves all the groups already created by the user
                const allGroups = [...resp2.data];
                this.setState({allGroups: allGroups});
            })
            .catch((error) => {
                //Sets error state
                this.setState({
                    snackMessage: "Could not load device's groups",
                    snackSeverity: "error"
                })
            })
        })
        .catch((error) => {
            //Sets error state
            this.setState({
                snackMessage: "Could not load device's configurations",
                snackSeverity: "error"
            })
        })
    }

    /**
     * On refresh interval text field change
     * @param event
     */
    handleRefreshRate(event) {
        this.setState({refreshRate: event.target.value});
    }

    /**
     * Remove a group from a device
     * @param groupIdToRemove ID of the group to remove
     */
    handleRemoveGroup(groupIdToRemove) {
        // copies groups in state
        const newGroups = this.state.deviceGroups;
        // find correct index
        const i = newGroups.findIndex(group => group.id === groupIdToRemove);
        // removes related group
        newGroups.splice(i, 1);
        this.setState({groups: newGroups})
    }

    /**
     * When a new group is created, add the group in backend and add it to the device
     * @param groupName Name of the group to be created
     */
    handleAddNewGroup = (groupName) => {

        const setGroup = (name) => {
            axios.get('groups/')
                .then((resp) => {

                    const allGroups = resp.data;

                    this.setState({
                        allGroups: allGroups
                    });

                    for (const [i,group] of Object.entries(allGroups)) {
                        if (group["name"] === name) {
                            const deviceGroups = this.state.deviceGroups;
                            deviceGroups.push(group);
                            console.log("setting " + group)
                            this.setState({
                                deviceGroups: deviceGroups
                            })
                        }
                    }
                    console.log(this.state)
                })
        }

        axios.post('groups/add/'+groupName)
            .then((resp) => {
                setGroup(groupName);
            })
    }

    /**
     * Set a group to the device
     * @param event GroupId in event.target.value
     */
    handleSetGroup = (event) => {
        const groupId = event.target.value;
        for (const [id, group] of Object.entries(this.state.allGroups)) {
            if (group["id"] === groupId) {
                const newGroups = this.state.deviceGroups;
                newGroups.push(group);
                this.setState({
                    deviceGroups: newGroups
                })
            }
        }
    }

    /**
     * Generate a new token for the device
     * @param event
     */
    handleToken(event) {
        // sets token
        axios.put('devices/'+this.props.match.params.id+'/generatetoken/')
            .then((resp) => {
                console.log(resp);
                this.setState({
                    token: resp.data.token
                })
            })
            .catch((error) => {
                this.setState({
                    snackMessage: "Could not generate token",
                    snackSeverity: "error"
                })
            })
    }

    handleOnOff(event) {
        this.setState({enabled: !this.state.enabled});
    }

    handleLatitude (event) {
        this.setState({latitude: event.target.value});
    }

    handleLongitude (event) {
        this.setState({longitude: event.target.value});
    }

    /**
     * Validate form checking the required fields
     * @returns A true value when the form is correctly validated
     */
    validateForm() {
        this.setState({
            error: {
                refreshRate: this.state.refreshRate ? "" : "Please enter a refresh interval",
                latitude: this.state.latitude ? "" : "Please insert a latitude",
                longitude: this.state.longitude ? "" : "Please insert a longitude"
            }
        })

        return this.state.refreshRate
            && this.state.latitude
            && this.state.longitude
    }

    /**
     * Save device's configuration
     * @param event
     */
    handleSave(event) {
        // check if form is valid
        if (this.validateForm()) {
            // sets frequency and enabled, latitude and longitude
            axios.put('devices/' + this.props.match.params.id + '/config', null, {
                params: {
                    "updateFrequency": parseInt(this.state.refreshRate),
                    "enabled": this.state.enabled,
                    "latitude": parseFloat(this.state.latitude),
                    "longitude": parseFloat(this.state.longitude)
                }
            })
                .then((resp) => {
                    console.log(resp);
                })
                .catch((error) => {
                    this.setState({
                        snackMessage: "Could not save configurations",
                        snackSeverity: "error"
                    })
                })

            // sets groups
            let groupsIds = []
            for (let i = 0; i < this.state.deviceGroups.length; i++) {
                groupsIds.push(Number(this.state.deviceGroups[i].id))
            }

            axios.post('devices/' + this.props.match.params.id + '/group/', groupsIds)
                .then((resp) => {
                    console.log(resp);
                    this.setState({
                        snackMessage: "Configuration saved successfully",
                        snackSeverity: "success"
                    })
                })
                .catch((error) => {
                    this.setState({
                        snackMessage: "Could not save device's groups",
                        snackSeverity: "error"
                    })
                })
        }
    }

    handleCancel() {
        window.location.reload();
    }

    /**
     * Get a list of groups that could be added to the device
     * @returns {*[]} List of groups
     */
    getGroupsCouldBeAdded() {
        let diff = [...this.state.allGroups];
        for (let i = 0; i < this.state.deviceGroups.length; i++) {
            let index = diff.findIndex(group => group.id === this.state.deviceGroups[i].id);
            if (index !== -1) {
                diff.splice(index, 1);
            }
        }
        return diff
    }

    render() {

        const { classes } = this.props;

        return (
            <div>
                <Paper className={classes.paper}>
                    <Typography component="h1" variant="h4" align="center">
                        Device configuration
                    </Typography>
                    <Typography variant="subtitle1" align="center">
                        Device {this.props.match.params.id}
                    </Typography>
                    <div style={{margin: 20}}>
                        <Typography variant="h6" gutterBottom>
                            Settings
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography display="inline">Enabled </Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.enabled}
                                            onChange={this.handleOnOff}
                                            color="primary"
                                        />
                                    }
                                    label={this.state.enabled ? "ON":"OFF"}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    type="number"
                                    id="refreshratetext"
                                    label="Refresh interval"
                                    value={this.state.refreshRate}
                                    helperText={this.state.error.refreshRate}
                                    onChange={this.handleRefreshRate}
                                    error={this.state.error.refreshRate}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="number"
                                    id="lat"
                                    label="Latitude"
                                    value={this.state.latitude}
                                    helperText={this.state.error.latitude}
                                    onChange={this.handleLatitude}
                                    error={this.state.error.latitude}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="number"
                                    id="lon"
                                    label="Longitude"
                                    value={this.state.longitude}
                                    helperText={this.state.error.longitude}
                                    onChange={this.handleLongitude}
                                    error={this.state.error.longitude}
                                />
                            </Grid>
                        </Grid>
                    </div>

                    <Divider/>

                    <div style={{margin: 20}}>
                        <Typography variant="h6" gutterBottom>
                            Groups
                        </Typography>
                        {
                            // creates as many group papers as needed
                            this.state.deviceGroups.map(g =>
                                <Chip className={classes.chip} key={g.id} label={g.name}
                                      onDelete={this.handleRemoveGroup.bind(this, g.id)}/>
                            )
                        }
                        <FormControl className={classes.formControl}>
                            <InputLabel id="group-select-label">Add group</InputLabel>
                            <Select
                                labelId="group-select-label"
                                id="group-select"
                                value=""
                                onChange={this.handleSetGroup}
                            >
                                {
                                    this.getGroupsCouldBeAdded().map(group =>
                                        <MenuItem key={group["id"]} value={group["id"]}>
                                            {group["name"]}
                                        </MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        <AddNewGroupDialog whenDone={this.handleAddNewGroup} />
                    </div>
                    <div className={classes.buttons}>
                        <div className={classes.button}>
                            <Button onClick={this.handleCancel} variant="contained" color="secondary">
                                Cancel
                            </Button>
                        </div>
                        <div className={classes.button}>

                            <Button onClick={this.handleSave} variant="contained" color="primary">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Paper>

                <Paper className={classes.paper}>
                    <Typography variant="h6" gutterBottom>
                        Device token
                    </Typography>
                    <TextField
                        disabled
                        id="tokenlabel"
                        label={String(this.state.token)}
                        helperText="Current token"
                    />
                    <div className={classes.buttons}>
                        <div className={classes.button}>
                            <Button onClick={this.handleToken} variant="contained" color="primary">Generate new</Button>
                        </div>
                    </div>
                </Paper>

                <SnackbarAlert
                    open={this.state.snackMessage !== ""}
                    autoHideDuration={3000}
                    onTimeout={() => this.setState({
                        snackMessage: ""
                    })}
                    severity={this.state.snackSeverity}
                    message={this.state.snackMessage}
                />
            </div>
        );
    }
}

export default withStyles(styles)(DeviceConfig)
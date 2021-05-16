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
import { withStyles } from '@material-ui/styles';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';


const styles = theme => ({
    paper: {
        margin: 20,
        padding: 5,
        minHeight: 10,
        minWidth: 300,
    },
    sub: {
        margin: 20,
        whiteSpace: "nowrap",
        float:"left",

    },
    box:{
        display: "flex",
        flexFlow: "row wrap",
        justifyContent: "flex-start",
        whiteSpace: "nowrap",
    
    },
    group: {
        margin: 20,
        padding: 0,
        minHeight: 50,
        minWidth: 100,
        backgroundColor: "#EAEAEA",
    },
    groupButton: {
        margin: 20,
        marginTop: -10,
        padding: 0,
        float:"right",
    },
    saveButton: {
        margin: 20,
        padding: 0,
        float:"left",
    },
    containerSave: {
        marginTop: 20,
        padding: 0,
        float:"left",
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },


});

const axios = require('axios').default


function AddNewGroupDialog(props) {

    // state capturing wether the dialog box is open or not
    const [open, setOpen] = React.useState(false);

    // state capturing wether the dialog box is open or not
    const [newGroupName, setNewGroupName] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleCloseNotSave = () => {
        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
        props.whenDone(newGroupName)
    }

    const handleChange = (event) => {
        setNewGroupName(event.target.value);
    }

    return (
        <div>
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
                    <form onChange={handleChange}>
                        <TextField
                            id="newgrouptext"
                            label="New group name"
                            placeholder="Name"
                            helperText="Add new group"
                            margin="normal"
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
            errorState: false,
            refreshRate: "",
            deviceGroups: [],
            token: "",
            enabled: false,
            latitude: "",
            longitude: "",
            newToken: false,
            allGroups: [],
        }

        this.handleRemoveGroup = this.handleRemoveGroup.bind(this);
        this.handleRefreshRate = this.handleRefreshRate.bind(this);
        this.handleOnOff = this.handleOnOff.bind(this);
        this.handleToken = this.handleToken.bind(this);
        this.handleRefreshLatitude = this.handleRefreshLatitude.bind(this);
        this.handleRefreshLongitude = this.handleRefreshLongitude.bind(this);
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
                    errorState: true,
                })
            })
        })
        .catch((error) => {
            //Sets error state
            this.setState({
                errorState: true,
            })
        })
    }

    handleRefreshRate(event) {
        this.setState({refreshRate: event.target.value});
    }

    handleRemoveGroup(groupIdToRemove) {
        // copies groups in state
        const newGroups = this.state.deviceGroups;
        // find correct index
        const i = newGroups.findIndex(group => group.id === groupIdToRemove);
        // removes related group
        newGroups.splice(i, 1);
        this.setState({groups: newGroups})
    }

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

    handleToken(event) {
        if (this.state.newToken) {
            this.setState({newToken: false});
        }
        else {
            this.setState({newToken: true})
        }
        event.preventDefault();
    }

    handleOnOff(event) {
        this.setState({enabled: !this.state.enabled});
    }

    handleRefreshLatitude (event) {
        this.setState({latitude: event.target.value});
    }

    handleRefreshLongitude (event) {
        this.setState({longitude: event.target.value});
    }

    handleSave(event) {

        // sets frequency and enabled
        axios.put('devices/'+this.props.match.params.id+'/config', null, {
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
            console.log(error.response);
        })
        
        // sets token
        if (this.state.newToken) {
            axios.put('devices/'+this.props.match.params.id+'/generatetoken/')
            .then((resp) => {
                console.log(resp);
            })
            .catch((error) => {
                console.log(error.response);
            })
        }

        // sets groups
        let groupsIds = []
        for (let i = 0; i < this.state.deviceGroups.length; i++) {
            groupsIds.push(Number(this.state.deviceGroups[i].id))
        }

        axios.post('devices/'+this.props.match.params.id+'/group/', groupsIds)
        .then((resp) => {
            console.log(resp);
        })
        .catch((error) => {
            console.log(error.response);
        })


    }

    handleCancel() {
        window.location.reload();
    }

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

        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        }
        else {
            return (
                <div className="deviceconfig">
                    <Grid container>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <div className={classes.box}>
                                    <div className={classes.sub}>
                                        <Typography>deviceID: {this.props.match.params.id} </Typography>
                                    </div>
                                    <div className={classes.sub}>
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
                                    </div>
                                </div>
                            </Paper>
                            <Paper className={classes.paper}>
                                <div className={classes.box}>
                                    <div className={classes.sub}>
                                        <form onChange={this.handleRefreshRate}>
                                            <TextField
                                                id="refreshratetext"
                                                label="Frequency"
                                                value={this.state.refreshRate}
                                                helperText="Customize device's refesh rate"
                                            />
                                        </form>
                                    </div>
                                </div>
                            </Paper>
                            <Paper className={classes.paper} >
                                <div className={classes.box}>
                                    <div className={classes.sub}>
                                        <form onChange={this.handleRefreshLatitude} css={{padding:"left"}}>
                                            <TextField
                                                id="lat"
                                                label="Latitude"
                                                value={this.state.latitude}
                                                helperText="Customize device's latitude"
                                            />
                                        </form>
                                    </div>
                                    <div className={classes.sub}>
                                        <form onChange={this.handleRefreshLongitude} css={{padding:"left"}}>
                                            <TextField
                                                id="lon"
                                                label="Longitude"
                                                value={this.state.longitude}
                                                helperText="Customize device's longitude"
                                            />
                                        </form>
                                    </div>
                                </div>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container>
                                    { 
                                        // creates as many group papers as needed
                                        this.state.deviceGroups.map(g => 
                                            <Chip key={g.id} label={g.name}
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
                                </Grid>
                            </Paper>

                            <div className={classes.groupButton}>
                                <AddNewGroupDialog whenDone={this.handleAddNewGroup} />
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper className={classes.paper}>
                                <Grid container>
                                    <div className={classes.box}>
                                        <div className={classes.sub}>
                                            <TextField
                                                disabled
                                                id="tokenlabel"
                                                label={String(this.state.token)}
                                                helperText="Current token"
                                                margin="normal"
                                            />    
                                        </div>
                                    </div>
                                </Grid>
                            </Paper>
                            <div className={classes.groupButton}>
                                {
                                    this.state.newToken 
                                    ? 
                                        <Button onClick={this.handleToken} variant="contained" color="primary">Don't generate</Button> 
                                    : 
                                        <Button onClick={this.handleToken} variant="contained" color="primary">Generate new</Button>
                                }
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div className={classes.containerSave}>
                                <div className={classes.saveButton}>
                                    <Button onClick={this.handleCancel} variant="contained" color="secondary">
                                        Cancel
                                    </Button>
                                </div>
                                <div className={classes.saveButton}>

                                    <Button onClick={this.handleSave} variant="contained" color="primary">
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        
                        </Grid>

                    </ Grid>
                </div>
            );
        }
    }
}

export default withStyles(styles)(DeviceConfig)
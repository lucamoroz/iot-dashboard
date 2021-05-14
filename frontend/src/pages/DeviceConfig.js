import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';


const axios = require('axios').default

const DeviceId = (props) => (
	<div>
  	    <Typography>deviceID: {props.id} </Typography>
	</div>
);

function AddGroupDialog(props) {

    const [open, setOpen] = React.useState(false);

    const [groupsToBeAdded, setGroupsToBeAdded] = React.useState(
        new Map(props.groupsCouldBeAdded.map(
                g => [String(g.id), false])
            )
    );

    const handleClickOpen = () => {
      setOpen(true);
      setGroupsToBeAdded(new Map(props.groupsCouldBeAdded.map(
        g => [String(g.id), false]) // TODO: set to true if corresponding group is selected already
      ))
    };
  
    const handleClose = () => {
      setOpen(false);
      //console.log(groupsToBeAdded);
      let addedIds = [];
      let notAddedIds = [];
      //console.log(groupsToBeAdded);
      for (const [k, v] of groupsToBeAdded) {
        if (v === true) {
            addedIds.push(Number(k));
        }
        else {
            notAddedIds.push(Number(k));
        }
      }
      props.whenDone(addedIds, notAddedIds);
    };

    const handleGroupsToBeAdded = (groups) => {
        setGroupsToBeAdded(groups);
    }

    return (
      <div>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Customize groups
        </Button>
        <Dialog
          open={open}
          //onClose={handleClose}
          aria-labelledby="add-group-dialog"
          aria-describedby="add-group-dialog-description"
        >
          <DialogTitle id="add-group-dialog">{"Customize device's groups"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="add-group-dialog-description">
              Select changes among your groups
            </DialogContentText>
            <CheckboxLabels groupsCouldBeAdded={props.groupsCouldBeAdded} deviceGroups={props.deviceGroups} whenDone={handleGroupsToBeAdded}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}

function CheckboxLabels(props) {

    const [groupsToBeAdded, setGroupsToBeAdded] = React.useState(
        new Map(props.groupsCouldBeAdded.map(
                g => [String(g.id), false]) // TODO: set to true if corresponding group is selected already
            )
    );

    const updateGroups = (k, v) => {
        setGroupsToBeAdded(new Map(groupsToBeAdded.set(k,v)));
        for (const [k, v] of groupsToBeAdded) {
            console.log("state of boxes"+k+"   "+v);
        }
    }

    const handleChange = (event) => {
        updateGroups(event.target.name, event.target.checked);
        props.whenDone(groupsToBeAdded); // gets arguments to the father, i.e. the dialog box
        
    };
    
    return (
      <FormGroup>
        {
            props.groupsCouldBeAdded.map(g => 
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={groupsToBeAdded.get(String(g.id))}
                            onChange={handleChange}
                            name={String(g.id)}
                            color="primary"
                        />
                    }
                    label={g.name}
                    key={String(g.id)}
                />
            )
        }
        {
            props.deviceGroups.map(g => 
                <FormControlLabel disabled control={<Checkbox checked name="NULL" />} label={g.name} key={String(g.id)}/>
            )
        }
      </FormGroup>
    );
}


class DeviceConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            refreshRate: null,
            deviceGroups: [],
            token: null,
            enabled: null,
            newToken: false,
            allGroups: [],
            groupsCouldBeAdded: [],
        }

        this.handleRemoveGroup = this.handleRemoveGroup.bind(this);
        this.handleRefreshChange = this.handleRefreshChange.bind(this);
        this.handleOnOff = this.handleOnOff.bind(this);
        this.handleToken = this.handleToken.bind(this);
        this.handleSave = this.handleSave.bind(this);
        //this.handleAddGroups = this.handleAddGroups(this);
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
            })
            axios.get('groups/')
            .then((resp2) => {
                // saves all the groups already created by the user
                const allGroups = [...resp2.data];
                this.setState({allGroups: allGroups});
            
                // inits groupsCouldBeAdded
                let diff = [...this.state.allGroups];
                for (let i = 0; i < this.state.deviceGroups.length; i++) {
                    let index = diff.findIndex(group => group.id === this.state.deviceGroups[i].id);
                    if (index !== -1) {
                        diff.splice(index, 1);
                    }
                }
                this.setState({groupsCouldBeAdded: [...diff]});
                console.log(this.state.groupsCouldBeAdded);
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

    handleRefreshChange(event) {
        this.setState({refreshRate: event.target.value});
    }

    handleRemoveGroup(event, id) {
        //alert('removing group');
        // copies groups in state
        let newGroups = [...this.state.groups];
        // find correct index
        let i = newGroups.findIndex(group => group.id === id);
        // removes related group
        newGroups.splice(i, 1);
        event.preventDefault();
        this.setState({groups: newGroups})
    }

    handleAddGroups = (addedIds, notAddedIds) => { // map of groups returned by dialog box
        console.log("gotten ids"+addedIds);

        for (let i = 0; i < addedIds.length; i++) {

            // adds the group to the device
            let indexToBeAdded = this.state.allGroups.findIndex(group => group.id === addedIds[i]);
            let newGroupToBeAdded = this.state.allGroups[indexToBeAdded];
            console.log("gotten group to add: "+newGroupToBeAdded.name);
            let updatedDeviceGroups = [...this.state.deviceGroups, newGroupToBeAdded];
            this.setState({deviceGroups: [...updatedDeviceGroups]}, () => {
                console.log(this.state.deviceGroups, 'device groups added');
            }); 

            // removes the group to the groups that could still be added to the device
            let indexToBeRemoved = this.state.groupsCouldBeAdded.findIndex(group => group.id === addedIds[i]);
            let updatedDeviceGroupsCouldBeAdded = [...this.state.groupsCouldBeAdded];
            updatedDeviceGroupsCouldBeAdded.splice(indexToBeRemoved, 1);
            this.setState({groupsCouldBeAdded: [...updatedDeviceGroupsCouldBeAdded]}, () => {
                console.log(this.state.groupsCouldBeAdded, 'device groups that could now be added');
            }); 
        }
    };

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
        if (this.state.enabled) {
            this.setState({enabled: false});
        }
        else {
            this.setState({enabled: true})
        }
        event.preventDefault();
    }

    handleSave(event) {

        // sets frequency and enabled
        axios.put('devices/'+this.props.match.params.id+'/config/'+
                '?updateFrequency='+this.state.refreshRate+
                '&enabled='+this.state.enabled)
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
        
        axios.put('devices/'+this.props.match.params.id+'/group/', groupsIds)
        .then((resp) => {
            console.log(resp);
        })
        .catch((error) => {
            console.log(error.response);
        })
    }
    
    render() {

        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        }
        else {
            return (
                <div className="deviceconfig">
                    <DeviceId id={this.props.match.params.id} />
                    <div className="refreshrate">
                        <form onChange={this.handleRefreshChange}>
                            <TextField
                                id="refreshratetext"
                                label="Frequency"
                                placeholder={this.props.refreshRate}
                                helperText="Customize device's refesh rate"
                                margin="normal"
                            />
                        </form>
  
                    </div>
                    { // creates as many group buttons as needed
                        this.state.deviceGroups.map(g => 
                            <div className="group" key={g.id}>
                                <Typography>{g.name}</Typography>
                            </div>
                        )
                    }
                    <div className="addgroup">
                        {console.log(this.state.groupsCouldBeAdded)}
                        <AddGroupDialog groupsCouldBeAdded={this.state.groupsCouldBeAdded} deviceGroups={this.state.deviceGroups} whenDone={this.handleAddGroups}/>
                    </div>
                    <div className="token">
                        <TextField disabled id="standard-disabled" defaultValue={String(this.props.token)} />
                           
                        {
                            this.state.newToken 
                            ? 
                                <Button onClick={this.handleToken} variant="contained" color="primary">Don't generate</Button> 
                            : 
                                <Button onClick={this.handleToken} variant="contained" color="primary">Generate</Button>
                        }
                    </div>
                    <div className="enabledevice">
                        <FormControlLabel
                            control={
                            <Switch
                                checked={this.state.enabled}
                                onChange={this.handleOnOff}
                                color="primary"
                            />
                            }
                            label={this.state.enabled ? "device ON":" device OFF"}
                        />
                    </div>
                    <div className="save">
                        
                        <Button onClick={this.handleSave} variant="contained" color="primary">
                            Save Changes
                        </Button>
                    </div>
                </div>
            );
        }
    }
}

export default DeviceConfig
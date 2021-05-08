import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     display: 'flex',
//     flexWrap: 'wrap',
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: '25ch',
//   },
// }));

// function RefreshForm(props) {
//   const classes = useStyles();

//   return (
//     <div className={classes.root}>
//       <div>
//         <TextField
//           id="standard-full-width"
//           label="New refresh rate"
//           style={{ margin: 8 }}
//           placeholder={props.rate}
//           margin="normal"
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />

//       </div>
//     </div>
//   );
// }

const axios = require('axios').default

const DeviceId = (props) => (
	<div>
  	    deviceID: {props.id}
	</div>
);

class Group extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        alert('pressed');
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.props.groupName}
                <button>-</button>
            </form>   
        );
    }
}

class GroupList extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (      
                this.props.groups.map(name => <Group groupName={name} />)
        );
    }
}


class DeviceConfig extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorState: false,
            refreshRate: null,
            groups: [],
            groupNames: [],
            token: null,
            enabled: null,
            newToken: false,
        }
        this.handleRemoveGroup = this.handleRemoveGroup.bind(this);
        this.handleRefreshChange = this.handleRefreshChange.bind(this);
        this.handleOnOff = this.handleOnOff.bind(this);
        this.handleToken = this.handleToken.bind(this);
    }

    componentDidMount() {

        axios.get('devices/3')
        .then((resp) => {
            // Copies the groups name from the response
            let groups = [...resp.data.groups];
            let names = groups.map(groupObj => groupObj.name);
            
            this.setState({
                refreshRate: resp.data.device.config.update_frequency,
                groups: groups,
                groupNames: names,
                token: resp.data.device.config.token,
                enabled: resp.data.device.config.enabled,
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
        alert('removing group');
        // copies groups in state
        let newGroups = [...this.state.groups];
        // find correct index
        let i = newGroups.findIndex(group => group.id === id);
        // removes related group
        newGroups.splice(i, 1);
        event.preventDefault();
        this.setState({groups: newGroups})
    }

    handleAddGroup(event) {
        alert("add group to be implemented");
        event.preventDefault();
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
        if (this.state.enabled) {
            this.setState({enabled: false});
        }
        else {
            this.setState({enabled: true})
        }
        event.preventDefault();
    }

    handleSave(event) {
        const data = {
            updateFrequency: this.state.refreshRate,
            enabled: this.state.enabled
        }
        const params = new URLSearchParams();
        params.append('updateFrequency', this.state.refreshRate);
        params.append('enabled', this.state.enabled);
        axios.put('devices/3/config', params)
        .then((resp) => {
            alert(resp);
        })
        .catch((error) => {
            console.log(error.response);
        })
        //event.preventDefault();
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
                    <DeviceId id="3" />
                    <div className="refreshrate">
                        <form onChange={this.handleRefreshChange}>
                            frequency={this.props.rate}
                            <input 
                                type="text" 
                                placeholder={this.state.refreshRate}
                            />
                        </form>
                    </div>
                    { // creates as many group buttons as needed
                        this.state.groups.map(gr => 
                            <div className="group" key={gr.id}>
                                <form onSubmit={e => this.handleRemoveGroup(e, gr.id)}>
                                    {gr.name}
                                    <button>(-)</button>
                                </form>
                            </div>
                        )
                    }
                    <div className="addgroupbutton">
                        <form onSubmit={this.handleAddGroup} >
                            <button>(+)</button>
                        </form>
                    </div>
                    <div className="token">
                        <form onSubmit={this.handleToken} >
                            token={this.state.token}
                            <button>{this.state.newToken ? "DONT GENERATE":"GENERATE NEW"}</button>
                        </form>
                    </div>
                    <div className="enabledevice">
                        <form onSubmit={this.handleOnOff} >
                            {this.state.enabled ? "device ON":" device OFF"}
                            <button>{this.state.enabled ? "OFF":"ON"}</button>
                        </form>
                    </div>
                    <div className="save">
                        <form onSubmit={this.handleSave} >
                            <button>SAVE CHANGES</button>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

export default DeviceConfig
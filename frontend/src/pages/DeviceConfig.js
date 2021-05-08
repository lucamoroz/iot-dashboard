import React from "react";

const axios = require('axios').default

const DeviceId = (props) => (
	<div>
  	    deviceID: {props.id}
	</div>
);

class DeviceConfig extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            refreshRate: null,
            groupNames: [],
            token: null,
            enabled: null,

        }
    }

    componentDidMount() {
        axios.get('devices/3')
        .then((resp) => {
            // Copies the groups name from the response
            let names = [...resp.data.groups].map(groupObj => groupObj.name)
            console.log(resp.data.device.config.update_frequency);
            console.log(names);
            console.log(resp.data.device.config.token);
            console.log(resp.data.device.config.enabled);

            this.setState({
                refreshRate: resp.data.device.config.update_frequency,
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
    
    render() {
        //console.log("devices/"+this.props.id);
        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        }
        else {
            return (
                <div>
                    <DeviceId id="3" />
                    <div> refresh rate={this.state.refreshRate} </div>
                    <div> group names={this.state.groupNames} </div>
                    <div> token={this.state.token} </div>
                    <div> enabled={this.state.token ? "ENABLED":"NOT ENABLED"} </div>
                </div>
            );
        }
    }
}

export default DeviceConfig
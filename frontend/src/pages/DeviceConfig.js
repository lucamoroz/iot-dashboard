import React from "react";

const axios = require('axios').default

const DeviceId = (props) => (
	<div>
  	    deviceID: {props.id}
	</div>
);

class DeviceGroups extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            groups: [],
        }
    }

    getGroups() {
        axios.get('devices/'+this.props.id)
        .then((resp) => {
            this.setState({
                deviceGroups: resp.groups[0].name,
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
        this.getGroups();
        console.log("'devices/'+this.props.id");
        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        }
        else {
            return (
                <div>
                    group1={this.state.groups}
                </div>
            );
        }
    }
}


class DeviceConfig extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <DeviceId id="5" />
                <DeviceGroups />
            </div>        
        );
    }
}

export default DeviceConfig
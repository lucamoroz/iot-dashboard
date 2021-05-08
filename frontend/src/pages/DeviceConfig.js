import React from "react";

const axios = require('axios').default

const DeviceId = (props) => (
	<div>
  	    deviceID: {props.id}
	</div>
);

class DeviceRefreshRate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            refreshRate: null,
        }
    }

    componentDidMount() {
        axios.get('devices/'+this.props.id)
        .then((resp) => {
            // Copies the groups name from the response
            this.setState({
                refreshRate: resp.data.device.config.update_frequency,
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
                    refresh rate={this.state.refreshRate}
                </div>
            );
        }
    }
}

class DeviceGroups extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            groupNames: [],
        }
    }

    componentDidMount() {
        axios.get('devices/'+this.props.id)
        .then((resp) => {
            // Copies the groups name from the response
            let names = [...resp.data.groups].map(groupObj => groupObj.name)
            this.setState({
                groupNames: names,
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
                    group names={this.state.groupNames}
                </div>
            );
        }
    }
}

class DeviceToken extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            token: "null",
        }
    }

    componentDidMount() {
        axios.get('devices/'+this.props.id)
        .then((resp) => {
            console.log(resp.data.device.config.token);
            this.setState({
                token: resp.data.device.config.token,
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
        //this.getDeviceToken();
        //console.log("devices/"+this.props.id);
        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        }
        else {
            return (
                <div>
                    token={this.state.token}
                </div>
            );
        }
    }
}

class DeviceEnabled extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorState: false,
            enabled: null,
        }
    }

    componentDidMount() {
        axios.get('devices/'+this.props.id)
        .then((resp) => {
            console.log(resp.data.device.config.enabled);
            this.setState({
                token: resp.data.device.config.enabled,
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
        //this.getDeviceToken();
        //console.log("devices/"+this.props.id);
        if (this.state.errorState) {
            return (
                <span>Error Loading data</span>
            );
        }
        else {
            return (
                <div>
                    enabled={this.state.token ? "ENABLED":"NOT ENABLED"}
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
                <DeviceId id="3" />
                <DeviceRefreshRate id={3} />
                <DeviceGroups id={3} />
                <DeviceToken id={3} />
                <DeviceEnabled id={3} />
            </div>        
        );
    }
}

export default DeviceConfig
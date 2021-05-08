import React from "react";

const axios = require('axios').default

const DeviceId = (props) => (
	<div>
  	    deviceID: {props.id}
	</div>
);

function DeviceGroups(props) {
    const [groups, setGroups] = React.useState([]);
    const [errorState, setErrorState] = React.useState(false);
    const deviceId = props.id;

    React.useEffect(() => {
        axios.get('devices/' + deviceId)
            .then(resp => {
                console.log(resp.data["groups"])
                setGroups(resp.data["groups"]);
            })
            .catch((error) => {
                setErrorState(true)
            })
    }, []);

    if (errorState) {
        return (
            <span>Error Loading data</span>
        );
    }
    else {
        return (
            <div>
                {groups.map(group => group.name)}
            </div>
        );
    }
}


class DeviceConfig extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div>
                <DeviceId id="8" />
                <DeviceGroups id="8"/>
            </div>        
        );
    }
}

export default DeviceConfig
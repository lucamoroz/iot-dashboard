import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { useState } from 'react';
import { featureGroup, LatLngBounds, latLngBounds } from 'leaflet';
import { CssBaseline } from '@material-ui/core';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import { green, red } from '@material-ui/core/colors';

const axios = require('axios').default

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    margin: 0,
    padding: 0,
    outline: 0,
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
    outline: 0,
  }

}));

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function timestampFormat(timestamp) {
  return new Date(Date.parse(timestamp)).toLocaleString();
}


export default function MapPage() {
  const classes = useStyles();
  const [state, setState] = useState({devices: [], bounds: []});
  const center = [51.505, -0.09] // Just a 
  useEffect(() => {
    axios.get("/devices?includeLastData=true")
      .then((res) => {
        console.log(res);
        var mbounds = [];
        res.data.forEach(device => {
          mbounds.push([device.device.config.latitude, device.device.config.longitude]);
        });
        console.log(mbounds);
       
        setState({devices: res.data, bounds: mbounds});
        
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function ChangeMapBounds({ bounds }) {
    const map = useMap();
    bounds.push([34.024212, -118.496475]); // Mockup bound just to avoid a crash
    
    var newBounds = latLngBounds(bounds);
    map.fitBounds(newBounds);
    return null;
  }

  return (
    <div className={classes.root}>
      <CssBaseline/>
      <MapContainer center={center} minZoom={0} maxZoom={13} zoom={6} scrollWheelZoom={false} markerZoomAnimation={true} className={classes.mapContainer}>
      <ChangeMapBounds bounds={state.bounds}/> 
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
        {
          
          state.devices.map((item) => (

            <Marker key={item.device.id} position={[item.device.config.latitude, item.device.config.longitude]}>
              <Popup>
                <h2 >{item.product_name.capitalize()}</h2> 
                <h3>Device info:</h3>
                {item.device.config.enabled ? <PowerIcon style={{color: green[500]}}/> : <PowerOffIcon style={{color: red[500]}}/>} <br /> 
                Lat: {item.device.config.latitude} <br />
                Lon: {item.device.config.longitude} <br />
                Freq: {item.device.config.update_frequency} <br />
                Battery: {item.device.deviceStatus.battery}% <br />
                Last Update: {timestampFormat(item.device.deviceStatus.last_update)} <br />
                
                <h3>Latest Data:</h3>
                {
                  Object.keys(item.data).map((key) => (
                    <h4 key={key}>{key.capitalize()}: {item.data[key]}</h4>
                  ))
                }
                
                <h3> Groups:</h3>
                {
                  item.groups.map((group) => (
                    <h4 key={group.id}>{group.name}</h4>
                  ))
                }
              </Popup>
            </Marker>
          ))

        }


      </MapContainer>
    </div>



  );
}

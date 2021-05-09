import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { useState } from 'react';
import { featureGroup, LatLngBounds, latLngBounds } from 'leaflet';

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



export default function MapPage() {
  const classes = useStyles();
  const [state, setState] = useState({devices: [], bounds: []});
  const center = [51.505, -0.09] // Just a 
  useEffect(() => {
    axios.get("/devices")
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
    bounds.push([51.505, -0.09]); // Mockup bound just to avoid a crash
    
    var newBounds = latLngBounds(bounds);
    map.fitBounds(newBounds);
    return null;
  }

  return (
    <div className={classes.root}>
      <MapContainer center={center} minZoom={0} maxZoom={13} zoom={6} scrollWheelZoom={false} markerZoomAnimation={true} className={classes.mapContainer}>
      <ChangeMapBounds bounds={state.bounds}/> 
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
        {
          
          state.devices.map((device) => (

            <Marker key={device.device.id} position={[device.device.config.latitude, device.device.config.longitude]}>
              <Popup>
                Lat: {device.device.config.latitude} Lon: {device.device.config.longitude} <br />
                Freq: {device.device.config.update_frequency} <br />
                Battery: {device.device.deviceStatus.battery}% <br />
                Last Update: {device.device.deviceStatus.last_update} <br />
               
              </Popup>
            </Marker>
          ))

        }


      </MapContainer>
    </div>



  );
}

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useEffect } from 'react';
import { useState } from 'react';

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



//Not optimized for network calls. For every render it calls the axiom.get function. TODO: Solve this by using react component
export default function MapPage() {
  const classes = useStyles();
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    axios.get("/devices")
      .then((res) => {
        console.log(res);
        setDevices(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={classes.root}>
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className={classes.mapContainer}>
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {
          devices.forEach((device, i) => {
            //console.log(device.device.config);
            var config = device.device.config;
            var lat = config.latitude;
            var lon = config.longitude;
            console.log(lat);
            console.log(lon);
            return (
              <Marker position={[51.505, -0.09]}>
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            );
          })
        }
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>

      </MapContainer>
    </div>



  );
}

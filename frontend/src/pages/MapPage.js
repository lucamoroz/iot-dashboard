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

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function timestampFormat(timestamp) {
  return new Date(Date.parse(timestamp)).toLocaleString();
}


export default function MapPage() {
  const classes = useStyles();
  const [state, setState] = useState({ devices: [], bounds: [] });
  const center = [51.505, -0.09] // Just a 
  useEffect(() => {
    axios.get("/devices?includeLastData=true")
      .then((res) => {
        console.log(res);
        var mbounds = [];
        res.data.forEach(device => {
          mbounds.push([device.device.config.latitude, device.device.config.longitude]);
        });

        setState({ devices: res.data, bounds: mbounds });

      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function ChangeMapBounds({ bounds }) {
    const map = useMap();
    //bounds.push([34.024212, -118.496475]); // Mockup bound just to avoid a crash

    var uniqueBounds = []; // Stores the unique coordinates for bounds. Multiple items with same coordinates will cause the map crash

    // Needs a much more optimized way to achieve that
    bounds.forEach((elem1) => {
      var unique = true;
      uniqueBounds.forEach((elem2) => {
        if (elem1[0] === elem2[0] && elem1[1] === elem2[1]) {
          unique = false;
          //Break statement in JS???
        }
      });
      if (unique) {
        uniqueBounds.push(elem1);
      }
    });


    if (uniqueBounds.length === 0) {
      return null;
    }

    /*if (uniqueBounds.length === 1) {
      //map.setView(uniqueBounds[0])
      var newBounds = latLngBounds(uniqueBounds);
      map.fitBounds(newBounds);
      return null;
    }*/


    var newBounds = latLngBounds(uniqueBounds);
    map.fitBounds(newBounds);
    return null;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <MapContainer center={center} minZoom={0} maxZoom={13} zoom={6} scrollWheelZoom={false} markerZoomAnimation={true} className={classes.mapContainer}>
        <ChangeMapBounds bounds={state.bounds} />
        <TileLayer
          attribution=''
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {

          state.devices.map((item) => (


            <Marker key={item.device.id} position={[item.device.config.latitude, item.device.config.longitude]}>
              <Popup>
                {item.device.config.enabled ? <PowerIcon style={{ color: green[500] }} /> : <PowerOffIcon style={{ color: red[500] }} />}
                <h2 >{item.product_name.capitalize()}</h2>
                <h3>Device info:</h3>
                <ul>
                  <li>Lat: {item.device.config.latitude}</li>
                  <li>Lon: {item.device.config.longitude}</li>
                  <li>Freq: {item.device.config.update_frequency}</li>
                  <li>Battery: {item.device.deviceStatus.battery}%</li>
                  <li>Last Update: {timestampFormat(item.device.deviceStatus.last_update)}</li>
                </ul>

                <h3> Groups:</h3>
                {
                  <ul>
                    {
                      item.groups.map((group) => (
                        <li key={group.id}>{group.name}</li>
                      ))
                    }
                  </ul>

                }

                <h3>Latest Data:</h3>
                {
                  <ul>
                    {
                      Object.keys(item.data).map((key) => (
                        <li key={key}>{key.capitalize()}: {item.data[key]}</li>
                      ))
                    }
                  </ul>

                }

              </Popup>
            </Marker>
          ))

        }


      </MapContainer>
    </div>



  );
}

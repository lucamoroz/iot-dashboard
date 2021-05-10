# Device mock
A python package that reads the UMass dataset: http://traces.cs.umass.edu/index.php/Smart/Smart
to mock a wind device and a THP (Temperature, Humidity, Pressure) device.

A part of the dataset can be found in data/

# Usage

## Build
With virtual environments run (inside the device-mock folder):
1. (optional, if you have virtual environments) `virtualenv venv -p=/usr/bin/python3.7` and `. venv/bin/activate`
2. `pip install -r src/requirements.txt`


If you are using docker-compose: see below

## CLI
Inside the `device-mock` folder, run:

- `python src/fakesensor.py data/HomeA/homeA2014.csv --endpoint http://localhost:8080/device/sensordata --columns temperature humidity pressure --auth-token 123 --replay-speed 1000` to mock a temperature, humidity, and pressure sensor
- `python src/fakesensor.py data/HomeA/homeA2014.csv --endpoint http://localhost:8080/device/sensordata --columns windSpeed windBearing --auth-token 123 --replay-speed 1000` to mock a wind sensor

Note: you may want to change the auth-token to mock a different device. The auth-token is used in the authorization header (e.g. Authorization: Bearer {auth-token})

## Docker
Add the following services to the `docker-compose` file:

```
  # A demo fake sensor (Anemometer)
  fake-anemometer:
    build:
      context: ./device-mock
      dockerfile: ./Dockerfile
    environment:
      - ENDPOINT=http://device-management-backend:8080/device/sensordata
      - REPLAY_SPEED=500
      - COLUMNS=windSpeed windBearing
      - AUTH_TOKEN=123
      - FILES=./data/HomeA/homeA2014.csv ./data/HomeA/homeA2015.csv ./data/HomeA/homeA2016.csv
    volumes:
      - ./device-mock/data:/app/data
    depends_on:
      - device-management-backend

  # A demo fake sensor (Anemometer)
  fake-multimeter:
    build:
      context: ./device-mock
      dockerfile: ./Dockerfile
    environment:
      - ENDPOINT=http://device-management-backend:8080/device/sensordata
      - REPLAY_SPEED=500
      - COLUMNS=temperature humidity pressure
      - AUTH_TOKEN=123
      - FILES=./data/HomeA/homeA2014.csv ./data/HomeA/homeA2015.csv ./data/HomeA/homeA2016.csv
    volumes:
      - ./device-mock/data:/app/data
    depends_on:
      - device-management-backend
```

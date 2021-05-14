# Device mock
A python package that reads the UMass dataset: http://traces.cs.umass.edu/index.php/Smart/Smart
to mock a wind device and a THP (Temperature, Humidity, Pressure) device.

The mocked devices will:
- Periodically poll the /device/config url to get the device's config. If the configuration has changed, it's updated so behaviour will change accordingly (e.g. data publish interval and if the device is enabled)
- Periodically publish status data. Each publication will reduce the device's battery by 1%
- Periodically publish data read from the dataset, if the device is enabled. The publishing interval is read from the device configuration.

Note: a part of the dataset can be found in data/.

# Usage

## Build
With virtual environments run (inside the device-mock folder):

- (optional, if you have virtual environments) `virtualenv venv -p=/usr/bin/python3.7` and `. venv/bin/activate`

- `pip install -r src/requirements.txt`


If you are using docker-compose: see below

## Parameters
- 

## CLI
Inside the `device-mock` folder, run:

- `python src/fakesensor.py data/HomeA/homeA2014.csv --backend http://localhost:8080 --columns windSpeed windBearing --auth-token 123 --cfg-poll-interval 10 --status-interval 5` to mock a wind sensor
- `python src/fakesensor.py data/HomeA/homeA2014.csv --backend http://localhost:8080 --columns temperature humidity pressure --auth-token 123 --cfg-poll-interval 10 --status-interval 5` to mock a wind sensor

Note: you may want to change the auth-token to mock a different device. The auth-token is used in the authorization header (e.g. Authorization: Bearer {auth-token})

Type `python src/fakesensor.py --help` to get arguments descriptions.

## Docker
Add the following services to the `docker-compose` file:

```
    # A demo fake sensor (Anemometer)
  fake-anemometer:
    build:
      context: ./device-mock
      dockerfile: ./Dockerfile
    environment:
      - BACKEND=http://device-management-backend:8080
      - COLUMNS=windSpeed windBearing
      - AUTH_TOKEN=123
      - CFG_POLL_INTERVAL=10
      - STATUS_INTERVAL=15
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
      - BACKEND=http://device-management-backend:8080
      - COLUMNS=temperature humidity pressure
      - AUTH_TOKEN=456
      - CFG_POLL_INTERVAL=10
      - STATUS_INTERVAL=15
      - FILES=./data/HomeA/homeA2014.csv ./data/HomeA/homeA2015.csv ./data/HomeA/homeA2016.csv
    volumes:
      - ./device-mock/data:/app/data
    depends_on:
      - device-management-backend
```

### Env variables
- BACKEND url of the backend
- COLUMNS list of columns to read from the files
- AUTH_TOKEN device authorization token
- CFG_POLL_INTERVAL seconds to wait before polling device config again
- STATUS_INTERVAL seconds to wait before publishing device status again
- FILES files from which data will be read
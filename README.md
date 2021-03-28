# IoT Dashboard #

Nowadays IoT is one of the fastest growing industries, we impersonate a company selling IoT sensors and we provide an online Dashboard for: user registration, data collection and visualization, device registration, management and monitoring. We charge our users on the basis of data usage.


## Table of Contents
- [Overview](#overview)
- [Usage](#usage)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)

## Overview
.....

## Usage

### Requirements
- Docker
- Docker Compose
- Make

### Environment
You can define project variables changing the `.env` file. 
This file is read by docker-compose to execute the services defined in docker-compose.yml.

### Build, Run, Clean
- Build and run the project: `make start`, to run on background use `make start-d`
- Stop: `make stop` or `make kill`
- See logs (useful if running on background): `make logs`
- Clean projects (deleting docker images too): `make purge`

### Database
All postgres data is contained in `database-postgres/data` folder.

For more information refer to: https://hub.docker.com/_/postgres

#### Connect to database
Run `make open-db` to open a `psql` terminal (useful to inspect the database or run raw SQL commands).

#### Populate database
In order to populate the database with some fake data, run `make populate-db`.

The SQL script that will be executed to populate the database can be found in `database-postgres/scripts/data.sql`.

#### Clear database
Run `sudo make delete-db` to delete all postgres data in order to start with a fresh new database.


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Team
Luca Moroldo
Nicola Maino
Francesco Pham
Fabio Vaccaro

| **[Stefano Ivancich](https://stefanoivancich.com)**| **[Denis Deronjic](https://github.com/deno750)** | **[Francesco Pham](https://github.com/frankplus)** | **[Luca Moroldo](https://github.com/lucamoroz)** |
| :---: |:---:|:---:|:---:|
| [![Stefano Ivancich](https://avatars1.githubusercontent.com/u/36710626?s=200&v=4)](https://stefanoivancich.com)    | [![Denis Deronjic](https://avatars1.githubusercontent.com/u/28018184?s=200&v=4)](https://github.com/deno750) | [![Francesco Pham](https://avatars.githubusercontent.com/u/3135881?s=200&v=4)](https://github.com/frankplus) | [![Luca Moroldo](https://avatars.githubusercontent.com/u/44212562?s=200&v=4)](https://github.com/lucamoroz)
| [`github.com/ivaste`](https://github.com/ivaste) | [`github.com/deno750`](https://github.com/deno750) | [`https://github.com/frankplus`](https://github.com/frankplus) | [`https://github.com/lucamoroz`](https://github.com/lucamoroz) |
...

## License
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

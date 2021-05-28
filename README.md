# IoT Dashboard


<!-- TABLE OF CONTENTS -->

**Table of Contents**
  <ol>
    <li>
      <a href="#overview">Overview</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
	<li><a href="#team">Team</a></li>
    <li><a href="#license">License</a></li>
  </ol>


## Overview
Nowadays IoT is one of the fastest growing industries, we impersonate a company selling IoT sensors and we provide an online Dashboard for: user registration, data collection and visualization, device registration, management and monitoring. We charge our users on the basis of data usage.


### Built With
* [Java](https://www.java.com/)
* [Spring Boot](https://spring.io/projects/spring-boot)
* [PostgreSQL](https://www.postgresql.org/)
* [React](https://reactjs.org/)
* [JavaScript](https://www.javascript.com/)
* [Material-UI](https://material-ui.com/)
* [Python](https://www.python.org/)


<!-- GETTING STARTED -->
## Getting Started

### Requirements
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Make](https://www.gnu.org/software/make/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

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

### Frontend
To install the necessary packages, in the `frontend/` directory run:
- `sudo rm package-lock.json`
- `sudo npm install` or `sudo yarn install`

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Team

| **[Stefano Ivancich](https://stefanoivancich.com)**| **[Denis Deronjic](https://github.com/deno750)** | **[Francesco Pham](https://github.com/frankplus)** |
| :---: |:---:|:---:|
| [![Stefano Ivancich](https://avatars1.githubusercontent.com/u/36710626?s=200&v=4)](https://stefanoivancich.com)    | [![Denis Deronjic](https://avatars1.githubusercontent.com/u/28018184?s=200&v=4)](https://github.com/deno750) | [![Francesco Pham](https://avatars.githubusercontent.com/u/3135881?s=200&v=4)](https://github.com/frankplus) |
| [`github.com/ivaste`](https://github.com/ivaste) | [`github.com/deno750`](https://github.com/deno750) | [`https://github.com/frankplus`](https://github.com/frankplus) |

| **[Luca Moroldo](https://github.com/lucamoroz)** | **[Fabio Vaccaro](https://www.linkedin.com/in/fabiovac/)** | **[Nicola Maino](https://www.linkedin.com/in/fabiovac/)** |
| :---: |:---:|:---:|
| [![Luca Moroldo](https://avatars.githubusercontent.com/u/44212562?s=200&v=4)](https://github.com/lucamoroz)| [![Fabio Vaccaro](https://avatars.githubusercontent.com/u/1366853?s=200&v=4)](https://github.com/fabiovac)| [![Nicola Maino](https://avatars.githubusercontent.com/u/62897883?s=200&v=4)](https://github.com/nmaino)|
| [`https://github.com/lucamoroz`](https://github.com/lucamoroz) | [`https://github.com/fabiovac`](https://github.com/fabiovac) | [`https://github.com/nmaino`](https://github.com/nmaino) |




## License
[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**

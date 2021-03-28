include .env
export

start: build run
start-d: build run-d

build: 
	cd device-management-backend && ./mvnw clean package -DskipTests=true && docker build --tag device-management-backend .
	docker-compose build

run:
	docker-compose up

run-d:
	docker-compose up -d

logs:
	docker-compose logs -f

stop:
	docker-compose stop

kill:
	docker-compose kill

open-db:
	docker exec -it database-postgres psql -U ${POSTGRES_USER} ${POSTGRES_DB}

populate-db:
	docker exec -it database-postgres bash -c "psql -d ${POSTGRES_DB} -a  -U ${POSTGRES_USER} -f /scripts/data.sql"

delete-db:
	rm -r database-postgres/data


purge:
	cd device-management-backend && ./mvnw clean
	docker-compose down -v --rmi all --remove-orphans

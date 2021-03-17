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

delete-db:
	chmod -R 777 postgres-data && rm -r postgres-data/


purge:
	cd device-management-backend && ./mvnw clean
	docker-compose down -v --rmi all --remove-orphans

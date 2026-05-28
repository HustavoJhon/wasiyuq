up:
	docker-compose up -d

down:
	docker-compose down

shell:
	docker-compose exec app bash

migrate:
	docker-compose exec app php artisan migrate --seed

sp:
	docker-compose exec app php artisan app:load-stored-procedures

test:
	docker-compose exec app php artisan test

build:
	docker-compose exec app npm run build

dev:
	docker-compose exec app npm run dev

pint:
	docker-compose exec app ./vendor/bin/pint

queue:
	docker-compose exec app php artisan queue:work --queue=default,notifications

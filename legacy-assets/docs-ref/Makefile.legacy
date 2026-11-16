permissions:
	sudo chown -R $(shell id -u):$(shell id -g) storage/ && chmod -R 777 storage/

create-db:
	docker-compose exec app php artisan app:create-database

migrate:
	docker-compose exec app php artisan migrate --seed

sp:
	docker-compose exec app php artisan app:load-stored-procedures

link:
	docker-compose exec app php artisan storage:link

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

setup: permissions create-db migrate sp link
	@echo "✅ Setup completo"

up:
	docker-compose up -d --build app

down:
	docker-compose down

shell:
	docker-compose exec app bash

p:
	@echo "Comandos disponibles:"
	@echo "  make setup       → Configura permisos, crea la BD, migra, carga SP y enlaza storage"
	@echo "  make create-db   → Crea la base de datos si no existe"
	@echo "  make migrate     → Ejecuta migraciones con seeders"
	@echo "  make sp          → Carga stored procedures"
	@echo "  make link        → Crea enlace simbólico de storage"
	@echo "  make permissions → Corrige permisos de storage"
	@echo "  make up/down     → Inicia/detiene contenedores"
	@echo "  make test        → Ejecuta tests"
	@echo "  make build/dev   → Compila frontend (producción/desarrollo)"
	@echo "  make pint        → Formatea código con Pint"
	@echo "  make shell       → Terminal dentro del contenedor app"
	@echo "  make queue       → Inicia el worker de colas"

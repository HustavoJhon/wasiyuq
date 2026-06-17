#!/bin/bash
set -e

# Crear directorios necesarios de storage si no existen
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/testing
mkdir -p /var/www/html/storage/logs

# Fijar permisos para que www-data (PHP-FPM) pueda escribir
chmod -R 777 /var/www/html/storage
chmod -R 777 /var/www/html/bootstrap/cache

# Ejecutar el comando original (CMD del Dockerfile)
exec "$@"

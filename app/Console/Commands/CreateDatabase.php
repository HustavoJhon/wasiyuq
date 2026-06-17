<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use PdoException;

#[Signature('app:create-database')]
#[Description('Crear la base de datos si no existe (solo SQL Server)')]
class CreateDatabase extends Command
{
    public function handle(): int
    {
        $connection = config('database.default');
        $driver = config("database.connections.$connection.driver");

        if ($driver !== 'sqlsrv') {
            $this->info("No es necesario crear la base de datos para el driver: $driver");

            return self::SUCCESS;
        }

        $database = config("database.connections.$connection.database");
        $host = config("database.connections.$connection.host");
        $port = config("database.connections.$connection.port");
        $username = config("database.connections.$connection.username");
        $password = config("database.connections.$connection.password");

        try {
            DB::connection("$connection")->getPdo();
            $this->info("La base de datos '$database' ya existe.");

            return self::SUCCESS;
        } catch (PdoException) {
        }

        $encrypt = config("database.connections.$connection.encrypt", 'no');
        $trustCert = config("database.connections.$connection.trust_server_certificate", 'true');

        $dsn = "sqlsrv:Server=$host,$port;Encrypt=$encrypt;TrustServerCertificate=$trustCert";

        try {
            $pdo = new \PDO($dsn, $username, $password, [
                \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
            ]);

            $pdo->exec("IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '$database') CREATE DATABASE [$database]");

            $this->info("Base de datos '$database' creada exitosamente.");
        } catch (\PDOException $e) {
            $this->error("Error al crear la base de datos: " . $e->getMessage());

            return self::FAILURE;
        }

        return self::SUCCESS;
    }
}

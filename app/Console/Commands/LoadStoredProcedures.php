<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

#[Signature('app:load-stored-procedures')]
#[Description('Load all stored procedures from database/stored-procedures/')]
class LoadStoredProcedures extends Command
{
    public function handle(): int
    {
        $basePath = database_path('stored-procedures');
        $files = collect(glob("$basePath/**/*.sql"));

        if ($files->isEmpty()) {
            $this->warn('No stored procedure files found.');

            return self::SUCCESS;
        }

        $count = 0;

        foreach ($files as $file) {
            $sql = file_get_contents($file);
            DB::connection('sqlsrv')->getPdo()->exec($sql);

            $relativePath = str_replace($basePath.'/', '', $file);
            $this->info("Loaded: $relativePath");
            $count++;
        }

        $this->info("Successfully loaded $count stored procedure(s).");

        return self::SUCCESS;
    }
}

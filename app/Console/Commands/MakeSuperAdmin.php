<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:make-super-admin {email : Email del usuario a promocionar}')]
#[Description('Promote a user to super admin')]
class MakeSuperAdmin extends Command
{
    public function handle(): int
    {
        $email = $this->argument('email');
        $user = User::query()->where('email', $email)->first();

        if (! $user) {
            $this->error("Usuario con email $email no encontrado.");

            return self::FAILURE;
        }

        $user->update(['is_super_admin' => true]);

        $this->info("Usuario {$user->name} ({$user->email}) ahora es super admin.");

        return self::SUCCESS;
    }
}

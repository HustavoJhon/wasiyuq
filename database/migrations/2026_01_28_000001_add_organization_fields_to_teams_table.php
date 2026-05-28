<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->text('bio')->nullable()->after('is_personal');
            $table->string('logo')->nullable()->after('bio');
            $table->string('website')->nullable()->after('logo');
            $table->string('phone')->nullable()->after('website');
            $table->string('address')->nullable()->after('phone');
            $table->string('city')->nullable()->after('address');
            $table->string('state')->nullable()->after('city');
            $table->json('social_links')->nullable()->after('state');
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn([
                'bio', 'logo', 'website', 'phone',
                'address', 'city', 'state', 'social_links',
            ]);
        });
    }
};

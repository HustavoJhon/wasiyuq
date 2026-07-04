<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->text('map_embed')->nullable()->after('social_links');
            $table->json('gallery')->nullable()->after('map_embed');
            $table->json('support_info')->nullable()->after('gallery');
        });
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn(['map_embed', 'gallery', 'support_info']);
        });
    }
};

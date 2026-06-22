<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('follow_ups', function (Blueprint $table) {
            $table->text('drive_link')->nullable()->after('photos');
            $table->decimal('weight_kg', 5, 2)->nullable()->after('drive_link');
            $table->json('vaccines')->nullable()->after('weight_kg');
            $table->text('behavior')->nullable()->after('vaccines');
            $table->string('health_status')->nullable()->after('behavior');
        });
    }

    public function down(): void
    {
        Schema::table('follow_ups', function (Blueprint $table) {
            $table->dropColumn(['drive_link', 'weight_kg', 'vaccines', 'behavior', 'health_status']);
        });
    }
};

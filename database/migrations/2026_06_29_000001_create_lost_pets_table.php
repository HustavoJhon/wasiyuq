<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lost_pets', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('species');
            $table->string('breed')->nullable();
            $table->string('color')->nullable();
            $table->string('size')->nullable();
            $table->string('age_description')->nullable();
            $table->text('description')->nullable();
            $table->string('last_seen_location');
            $table->date('last_seen_date');
            $table->string('contact_phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->json('photos')->nullable();
            $table->string('status')->default('lost');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
            $table->boolean('is_resolved')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lost_pets');
    }
};

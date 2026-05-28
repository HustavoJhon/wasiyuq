<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('species');
            $table->string('breed')->nullable();
            $table->integer('age_years')->default(0);
            $table->integer('age_months')->default(0);
            $table->string('gender');
            $table->string('size');
            $table->string('color')->nullable();
            $table->text('description');
            $table->text('medical_notes')->nullable();
            $table->string('status')->default('available');
            $table->json('photos')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pets');
    }
};

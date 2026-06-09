<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('adoptions', function (Blueprint $table) {
            $table->text('why_this_pet')->nullable()->after('motivation');
            $table->boolean('has_children')->nullable()->after('family_composition');
            $table->text('other_pets')->nullable()->after('has_children');
            $table->string('housing_ownership')->nullable()->after('other_pets');
            $table->unsignedTinyInteger('hours_alone')->nullable()->after('housing_ownership');
            $table->text('veterinary_plan')->nullable()->after('hours_alone');
            $table->boolean('agreement')->nullable()->after('veterinary_plan');
        });
    }

    public function down(): void
    {
        Schema::table('adoptions', function (Blueprint $table) {
            $table->dropColumn([
                'why_this_pet', 'has_children', 'other_pets',
                'housing_ownership', 'hours_alone', 'veterinary_plan', 'agreement',
            ]);
        });
    }
};

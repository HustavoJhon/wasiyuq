<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("announcements", function (Blueprint $table) {
            $table->text("cover_image")->nullable()->change();
        });

        Schema::table("blog_posts", function (Blueprint $table) {
            $table->text("cover_image")->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table("announcements", function (Blueprint $table) {
            $table->string("cover_image")->nullable()->change();
        });

        Schema::table("blog_posts", function (Blueprint $table) {
            $table->string("cover_image")->nullable()->change();
        });
    }
};

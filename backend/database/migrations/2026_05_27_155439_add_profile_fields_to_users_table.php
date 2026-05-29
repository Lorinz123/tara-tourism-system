<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('tagline')->nullable();
            $table->text('announcement')->nullable();
            $table->string('hero_image')->nullable();
            // Added the missing fields
            $table->string('address')->nullable();
            $table->string('hours')->nullable();
            $table->string('contact')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tagline', 'announcement', 'hero_image', 'address', 'hours', 'contact']);
        });
    }
};
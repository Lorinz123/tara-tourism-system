<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop legacy separate tables safely to clean up the ecosystem
        Schema::dropIfExists('tourists');
        Schema::dropIfExists('owners');
        Schema::dropIfExists('users');

        // Create the clean, unified table
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->enum('role', ['tourist', 'owner'])->default('tourist');
            $table->string('restaurant')->nullable(); // Only used for owners
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create a Tourist Account
        User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@gmail.com',
            'password' => Hash::make('juan123'),
            'role' => 'tourist', // Dynamic role in DB
        ]);

        // 2. Create Owner Account: Zubuchon
        User::create([
            'name' => 'Zubuchon',
            'email' => 'zubuchon@gmail.com',
            'password' => Hash::make('zubuchon123'),
            'role' => 'owner', // Dynamic role in DB
        ]);

        // 3. Create Owner Account: Lantaw
        User::create([
            'name' => 'Lantaw',
            'email' => 'lantaw@gmail.com',
            'password' => Hash::make('lantaw123'),
            'role' => 'owner',
        ]);

        // 4. Create Owner Account: Golden Cowrie
        User::create([
            'name' => 'Golden Cowrie',
            'email' => 'cowrie@gmail.com',
            'password' => Hash::make('cowrie123'),
            'role' => 'owner',
        ]);
    }
}
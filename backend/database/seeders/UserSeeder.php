<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing records to prevent duplicate email key errors during re-runs
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        User::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $users = [
            [
                'name' => 'Juan Dela Cruz',
                'email' => 'juan@gmail.com',
                'password' => Hash::make('juan123'),
                'role' => 'tourist',
                'restaurant' => null,
            ],
            [
                'name' => 'Zubu',
                'email' => 'zubuchon@gmail.com',
                'password' => Hash::make('zubuchon123'),
                'role' => 'owner',
                'restaurant' => 'Zubuchon',
            ],
            [
                'name' => 'lantaw',
                'email' => 'lantaw@gmail.com',
                'password' => Hash::make('lantaw123'),
                'role' => 'owner',
                'restaurant' => 'Lantaw',
            ],
            [
                'name' => 'Golden Cowrie',
                'email' => 'cowrie@gmail.com',
                'password' => Hash::make('cowrie123'),
                'role' => 'owner',
                'restaurant' => 'Golden Cowrie',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
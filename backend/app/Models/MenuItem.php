<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class MenuItem extends Model
{
    protected $fillable = [
        'user_id', 
        'name', 
        'category', 
        'price', 
        'description', 
        'image_url', 
        'available'
    ];

    /**
     * Get the owner of the menu item.
     */
    public function owner()
    {
        // This is the missing link!
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }
}
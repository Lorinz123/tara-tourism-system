<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PlaceController;

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

Route::post('/reset-password', [AuthController::class, 'resetPassword']);

/*
|--------------------------------------------------------------------------
| AUTHENTICATED USER
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get(
    '/user',
    function (Request $request) {
        return $request->user();
    }
);

/*
|--------------------------------------------------------------------------
| PLACE / TOURISM SITE ROUTES
|--------------------------------------------------------------------------
*/

// GET all places
Route::get(
    '/all-places',
    [PlaceController::class, 'allPlaces']
);

// GET single place
Route::get(
    '/places/{id}',
    [PlaceController::class, 'show']
);

// GET places of specific owner
Route::get(
    '/owner-places/{ownerId}',
    [PlaceController::class, 'index']
);

// CREATE place
Route::middleware('auth:sanctum')->post('/places', [PlaceController::class, 'store']);

// UPDATE place
Route::put(
    '/places/{id}',
    [PlaceController::class, 'update']
);

// DELETE place
Route::delete(
    '/places/{id}',
    [PlaceController::class, 'destroy']
);

/*
|--------------------------------------------------------------------------
| MENU MANAGEMENT ROUTES
|--------------------------------------------------------------------------
*/

// GET all menu items
Route::get(
    '/menu-items',
    [MenuController::class, 'index']
);

// GET single menu item
Route::get(
    '/menu-items/{id}',
    [MenuController::class, 'show']
);

// GET owner's menu
Route::get(
    '/owner-menu/{ownerId}',
    [MenuController::class, 'getOwnerMenu']
);

// CREATE menu item
Route::post(
    '/menu-items',
    [MenuController::class, 'store']
);

// UPDATE menu item
Route::put(
    '/menu-items/{id}',
    [MenuController::class, 'update']
);

// DELETE menu item
Route::delete(
    '/menu-items/{id}',
    [MenuController::class, 'destroy']
);

/*
|--------------------------------------------------------------------------
| PROFILE MANAGEMENT ROUTES
|--------------------------------------------------------------------------
*/

// GET user profile
Route::middleware('auth:sanctum')->get(
    '/users/{id}/profile',
    [MenuController::class, 'getProfile']
);

// UPDATE user profile
Route::middleware('auth:sanctum')->put(
    '/users/{id}/profile',
    [MenuController::class, 'updateProfile']
);

/*
|--------------------------------------------------------------------------
| HOTEL / OWNER SPECIFIC ROUTES
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // UPDATED: Changed 'myPlaces' to 'myHotels'
    Route::get('/my-hotels', [PlaceController::class, 'myHotels']);
    
    // These routes look good, they already point to 'show' and 'update'
    Route::get('/my-hotels/{id}', [PlaceController::class, 'show']);
    Route::put('/my-hotels/{id}', [PlaceController::class, 'update']);
});

// Add this route (outside the auth middleware)
Route::get('/places/{id}', [PlaceController::class, 'showPublic']);
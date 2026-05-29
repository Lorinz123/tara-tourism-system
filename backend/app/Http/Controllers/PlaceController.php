<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Place;
use Illuminate\Support\Facades\Auth;

class PlaceController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET ALL PLACES
    |--------------------------------------------------------------------------
    */
    public function allPlaces()
    {
        try {
            $places = Place::latest()->get();
            return response()->json($places);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch places', 'error' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | GET SINGLE PLACE (Updated to verify ownership if needed)
    |--------------------------------------------------------------------------
    */
    public function show($id)
{
    try {
        // This query will fail (404) if the place doesn't belong to the logged-in user
        $place = Place::where('id', $id)->where('owner_id', Auth::id())->firstOrFail();
        return response()->json($place);
    } catch (\Exception $e) {
        // If the query fails, it returns 404
        return response()->json(['message' => 'Place not found or unauthorized'], 404);
    }
}

    /*
    |--------------------------------------------------------------------------
    | GET OWNER PLACES
    |--------------------------------------------------------------------------
    */
    public function index($ownerId)
    {
        try {
            $places = Place::where('owner_id', $ownerId)->latest()->get();
            return response()->json($places);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch owner places', 'error' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE PLACE (Consolidated Logic)
    |--------------------------------------------------------------------------
    */
    public function update(Request $request, $id)
    {
        try {
            $place = Place::where('id', $id)->where('owner_id', Auth::id())->firstOrFail();
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'image_url' => 'required|string',
                'address' => 'required|string|max:255',
                'owner_id' => 'nullable',
            ]);

            $place->update($validated);
            return response()->json(['message' => 'Place updated successfully', 'place' => $place]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update place', 'error' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE PLACE
    |--------------------------------------------------------------------------
    */
    public function destroy($id)
    {
        try {
            $place = Place::findOrFail($id);
            $place->delete();
            return response()->json(['message' => 'Place deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete place', 'error' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | STORE
    |--------------------------------------------------------------------------
    */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'image_url' => 'required|string',
                'address' => 'required|string|max:255',
                'booking_url' => 'nullable|url', 
                'owner_id' => 'required|integer',
            ]);

            $place = Place::create($validated);
            return response()->json(['message' => 'Place created successfully', 'place' => $place], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create place', 'error' => $e->getMessage()], 500);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | MY HOTELS / MY PLACES (Consolidated)
    |--------------------------------------------------------------------------
    */
    public function myHotels(Request $request)
    {
        try {
            \Log::info("Current User ID: " . Auth::id());
            // This replaces your previous 'myPlaces' and 'myHotels' methods
            $places = Place::where('owner_id', Auth::id())->get();
            return response()->json($places);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch hotels', 'error' => $e->getMessage()], 500);
        }
    }

    public function showPublic($id)
{
    $place = Place::find($id);
    if (!$place) {
        return response()->json(['message' => 'Not found'], 404);
    }
    return response()->json($place);
}
}
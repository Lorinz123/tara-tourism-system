<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Place;
use Illuminate\Support\Facades\Auth;

class PlaceController extends Controller
{
    // Admin sees all, Owner only sees theirs
    public function allPlaces(Request $request)
    {
        try {
            $user = $request->user();
            if ($user && $user->role === 'admin') {
                return response()->json(Place::latest()->get());
            }
            return response()->json(Place::where('owner_id', Auth::id())->latest()->get());
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to fetch places', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Request $request, $id)
    {
        try {
            $user = $request->user();
            $query = Place::where('id', $id);

            // If not admin, restrict to owner_id
            if ($user->role !== 'admin') {
                $query->where('owner_id', Auth::id());
            }

            $place = $query->firstOrFail();
            return response()->json($place);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Place not found or unauthorized'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = $request->user();
            $query = Place::where('id', $id);

            if ($user->role !== 'admin') {
                $query->where('owner_id', Auth::id());
            }

            $place = $query->firstOrFail();
            
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'image_url' => 'required|string',
                'address' => 'required|string|max:255',
            ]);

            $place->update($validated);
            return response()->json(['message' => 'Place updated successfully', 'place' => $place]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        try {
            $user = $request->user();
            $query = Place::where('id', $id);

            // Restrict deletion to admin
            if ($user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            $place = $query->firstOrFail();
            $place->delete();
            return response()->json(['message' => 'Place deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'image_url' => 'required|string',
                'address' => 'required|string|max:255',
            ]);

            $validated['owner_id'] = Auth::id();
            $place = Place::create($validated);
            return response()->json(['message' => 'Place created successfully', 'place' => $place], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create place', 'error' => $e->getMessage()], 500);
        }
    }
}
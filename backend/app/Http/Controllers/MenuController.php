<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\User;
use Illuminate\Support\Facades\Validator;

class MenuController extends Controller
{
    // 1. Fetch ALL menu items (Eager load the owner)
    public function index()
    {
        $items = MenuItem::with('owner')->get();
        return response()->json($items, 200);
    }

    // 2. Fetch ONE item (Eager load the owner)
    public function show($id)
    {
        $item = MenuItem::with('owner')->find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }
        return response()->json($item, 200);
    }

    // 3. Fetch items for a specific owner
    public function getOwnerMenu($ownerId)
    {
        $items = MenuItem::where('user_id', $ownerId)->get();
        return response()->json($items, 200);
    }

    // 4. Update Owner Profile
    public function updateProfile(Request $request, $id)
{
    // Ensure the user exists
    $user = User::findOrFail($id);
    
    // Authorization
    if ($user->id != $request->user()->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    // Validate fields
    $validated = $request->validate([
        'tagline' => 'nullable|string',
        'announcement' => 'nullable|string',
        'hero_image' => 'nullable|string',
        'address' => 'nullable|string',
        'hours' => 'nullable|string',
        'contact' => 'nullable|string',
        'tags' => 'nullable', 
    ]);

    // Update
    $user->update($validated);
    return response()->json(['success' => true, 'user' => $user], 200);
}

    // 5. Store new menu item
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|string',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $item = MenuItem::create($request->all());
        return response()->json(['success' => true, 'item' => $item], 201);
    }

    // 6. Update menu item
    public function update(Request $request, $id)
    {
        $item = MenuItem::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        if ($item->user_id != $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->update($request->all());
        return response()->json(['success' => true, 'item' => $item], 200);
    }

    // 7. Delete menu item
    public function destroy(Request $request, $id)
    {
        $item = MenuItem::find($id);
        if (!$item) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        if ($item->user_id != $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $item->delete();
        return response()->json(['success' => true, 'message' => 'Item removed successfully'], 200);
    }

    public function getProfile($id)
{
    $user = User::findOrFail($id);
    return response()->json($user, 200);
}
}
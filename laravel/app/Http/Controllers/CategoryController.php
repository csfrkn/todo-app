<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Tüm kategorileri listele
     */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('todos')->get();
        return response()->json([
            'status' => 'success',
            'data' => $categories
        ]);
    }

    /**
     * Yeni kategori oluştur
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories',
            'color' => 'required|string|max:7|regex:/^#[A-Fa-f0-9]{6}$/',
            'description' => 'nullable|string|max:1000'
        ]);

        $category = Category::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori başarıyla oluşturuldu',
            'data' => $category
        ], 201);
    }

    /**
     * Belirli bir kategoriyi getir
     */
    public function show(Category $category): JsonResponse
    {
        $category->load(['todos' => function ($query) {
            $query->latest();
        }]);
        
        return response()->json([
            'status' => 'success',
            'data' => $category
        ]);
    }

    /**
     * Kategoriyi güncelle
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($category->id)],
            'color' => 'required|string|max:7|regex:/^#[A-Fa-f0-9]{6}$/',
            'description' => 'nullable|string|max:1000'
        ]);

        $category->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori başarıyla güncellendi',
            'data' => $category
        ]);
    }

    /**
     * Kategoriyi sil
     */
    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori başarıyla silindi'
        ]);
    }

    /**
     * Belirli bir kategoriye ait todo'ları listele
     */
    public function todos(Category $category): JsonResponse
    {
        $todos = $category->todos()->with('categories')->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $todos
        ]);
    }

    /**
     * Todo'ya kategori ata veya kaldır
     */
    public function toggleTodoCategories(Request $request, $todoId): JsonResponse
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id'
        ]);

        $todo = \App\Models\Todo::findOrFail($todoId);
        $todo->categories()->sync($validated['categories']);

        return response()->json([
            'status' => 'success',
            'message' => 'Kategoriler başarıyla güncellendi'
        ]);
    }
}

<?php

use App\Http\Controllers\TodoController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

// Todo Routes
Route::prefix('todos')->group(function () {
    Route::get('/stats', [TodoController::class, 'stats']);
    Route::get('/search', [TodoController::class, 'search']);
    Route::get('/', [TodoController::class, 'index']);
    Route::post('/', [TodoController::class, 'store']);
    Route::get('/{id}', [TodoController::class, 'show']);
    Route::put('/{id}', [TodoController::class, 'update']);
    Route::delete('/{id}', [TodoController::class, 'destroy']);
    Route::patch('/{id}/status', [TodoController::class, 'updateStatus']);
});

// Category Routes
Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{category}', [CategoryController::class, 'show']);
    Route::put('/{category}', [CategoryController::class, 'update']);
    Route::delete('/{category}', [CategoryController::class, 'destroy']);
    Route::get('/{category}/todos', [CategoryController::class, 'todos']);
});

// Todo Categories Management
Route::post('/todos/{todo}/categories', [CategoryController::class, 'toggleTodoCategories']); 
<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Todo::with('categories');

        if ($request->filled('status')) $query->where('status', $request->status);
        if ($request->filled('priority')) $query->where('priority', $request->priority);

        // Toplam todo sayısını logla
        $totalCount = $query->count();
        Log::info('Total todos in database: ' . $totalCount);

        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');
        $limit = $request->input('limit', 12);

        // Query'i logla
        Log::info('Todo query parameters:', [
            'sort' => $sort,
            'order' => $order,
            'limit' => $limit,
            'status' => $request->status,
            'priority' => $request->priority
        ]);

        $todos = $query->orderBy($sort, $order)->paginate($limit);

        // Pagination meta verilerini ayır
        $paginationData = [
            'current_page' => $todos->currentPage(),
            'last_page' => $todos->lastPage(),
            'per_page' => $todos->perPage(),
            'total' => $todos->total(),
            'from' => $todos->firstItem(),
            'to' => $todos->lastItem(),
        ];

        // Response'u logla
        Log::info('Sending todos response:', [
            'total_items' => $todos->total(),
            'current_page' => $todos->currentPage(),
            'per_page' => $todos->perPage(),
            'items_in_response' => count($todos->items())
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $todos->items(),
            'meta' => [
                'pagination' => $paginationData
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|max:500',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date|after_or_equal:today',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id'
        ]);

        // Kategorileri ayır
        $categories = null;
        if (isset($validated['categories'])) {
            $categories = $validated['categories'];
            unset($validated['categories']);
        }

        $todo = Todo::create($validated);

        // Kategorileri ekle
        if ($categories) {
            $todo->categories()->sync($categories);
        }

        // İlişkileri yükle ve döndür
        $todo->load('categories');
        return response()->json(['status' => 'success', 'data' => $todo], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $todo = Todo::with('categories')->findOrFail($id);
        return response()->json(['status' => 'success', 'data' => $todo]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $todo = Todo::with('categories')->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|min:3|max:100',
            'description' => 'nullable|max:500',
            'status' => 'in:pending,in_progress,completed',
            'priority' => 'in:low,medium,high',
            'due_date' => 'nullable|date|after_or_equal:today',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id'
        ]);

        // Kategori ilişkisini güncelle
        if (isset($validated['categories'])) {
            $todo->categories()->sync($validated['categories']);
            unset($validated['categories']);
        }

        $todo->update($validated);
        $todo->load('categories'); // İlişkileri yeniden yükle
        return response()->json(['status' => 'success', 'data' => $todo]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);
        $todo->delete();
        return response()->json(null, 204);
    }

    /**
     * Update the status of a todo.
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:pending,in_progress,completed']);
        $todo = Todo::findOrFail($id);
        $todo->update(['status' => $request->status]);
        return response()->json(['status' => 'success']);
    }

    /**
     * Search todos by title or description.
     */
    public function search(Request $request)
    {
        $q = $request->input('q', '');
        $query = Todo::with('categories')
            ->where(function($query) use ($q) {
                $query->where('title', 'like', "%$q%")
                    ->orWhere('description', 'like', "%$q%");
            });

        // Apply filters if provided
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        // Apply sorting
        $sort = $request->input('sort', 'created_at');
        $order = $request->input('order', 'desc');
        $query->orderBy($sort, $order);

        // Get paginated results
        $limit = $request->input('limit', 12);
        $todos = $query->paginate($limit);

        // Prepare pagination metadata
        $paginationData = [
            'current_page' => $todos->currentPage(),
            'last_page' => $todos->lastPage(),
            'per_page' => $todos->perPage(),
            'total' => $todos->total(),
            'from' => $todos->firstItem(),
            'to' => $todos->lastItem(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => $todos->items(),
            'meta' => [
                'pagination' => $paginationData
            ]
        ]);
    }

    /**
     * Get todo statistics.
     */
    public function stats(): JsonResponse
    {
        // Durum sayılarını hesapla
        $statusCounts = Todo::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status')
            ->toArray();

        // Öncelik sayılarını hesapla
        $priorityCounts = Todo::select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->get()
            ->pluck('count', 'priority')
            ->toArray();

        // Varsayılan değerleri ayarla
        $stats = [
            'statusCounts' => [
                'pending' => $statusCounts['pending'] ?? 0,
                'in_progress' => $statusCounts['in_progress'] ?? 0,
                'completed' => $statusCounts['completed'] ?? 0
            ],
            'priorityCounts' => [
                'high' => $priorityCounts['high'] ?? 0,
                'medium' => $priorityCounts['medium'] ?? 0,
                'low' => $priorityCounts['low'] ?? 0
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => $stats
        ]);
    }
}

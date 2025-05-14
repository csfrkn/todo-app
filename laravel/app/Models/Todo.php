<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Todo extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'due_date'
    ];

    protected $casts = [
        'due_date' => 'date'
    ];

    // Todo'ya ait kategorileri getir
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_todo')
                    ->withTimestamps();
    }
}

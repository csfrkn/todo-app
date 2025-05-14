<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'color',
        'description'
    ];

    // Kategoriye ait todo'ları getir
    public function todos()
    {
        return $this->belongsToMany(Todo::class, 'category_todo')
                    ->withTimestamps();
    }
}

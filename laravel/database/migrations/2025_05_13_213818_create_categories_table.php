<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->default('#3B82F6'); // Varsayılan mavi renk
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes(); // Kategorileri silmek yerine soft delete yapalım
        });

        // Kategoriler ve todo'lar arasındaki çoklu ilişki için pivot tablo
        Schema::create('category_todo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignId('todo_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_todo');
        Schema::dropIfExists('categories');
    }
};

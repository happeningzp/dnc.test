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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->index()->constrained('tasks')->onDelete('cascade');
            $table->foreignId('user_id')->index()->constrained();
            $table->string('title', 255);
            $table->text('description')->nullable();
            $table->tinyInteger('status')->default(0)->index();
            $table->smallInteger('priority');
            $table->timestamp('completed_at')->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};

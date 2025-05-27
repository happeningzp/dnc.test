<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskParentValidationTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user, 'sanctum'); // Authenticate user for API requests
    }

    private function createTask(array $attributes = []): Task
    {
        if (!isset($attributes['user_id'])) {
            $attributes['user_id'] = $this->user->id;
        }
        return Task::factory()->create($attributes);
    }

    // StoreTaskRequest Tests

    /** @test */
    public function store_task_with_valid_parent_id()
    {
        $parentTask = $this->createTask();
        $response = $this->postJson('/api/tasks', [
            'title' => 'Sub Task',
            'priority' => 1,
            'parent_id' => $parentTask->id,
        ]);
        $response->assertStatus(200) // Assuming BaseController::responseSuccess returns 200
                 ->assertJsonPath('data.title', 'Sub Task')
                 ->assertJsonPath('data.parent_id', $parentTask->id);
    }

    /** @test */
    public function store_task_with_non_existent_parent_id_fails()
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Sub Task',
            'priority' => 1,
            'parent_id' => 9999, // Non-existent ID
        ]);
        $response->assertStatus(422) // Unprocessable Entity for validation errors
                 ->assertJsonValidationErrors(['parent_id']);
    }

    /** @test */
    public function store_task_with_null_parent_id()
    {
        $response = $this->postJson('/api/tasks', [
            'title' => 'Parent Task',
            'priority' => 1,
            'parent_id' => null,
        ]);
        $response->assertStatus(200)
                 ->assertJsonPath('data.title', 'Parent Task')
                 ->assertJsonPath('data.parent_id', null);
    }

    // UpdateTaskRequest Tests

    /** @test */
    public function update_task_with_valid_parent_id()
    {
        $taskToUpdate = $this->createTask();
        $newParentTask = $this->createTask();

        $response = $this->putJson("/api/tasks/{$taskToUpdate->id}", [
            'parent_id' => $newParentTask->id,
        ]);
        $response->assertStatus(200)
                 ->assertJsonPath('data.parent_id', $newParentTask->id);
    }

    /** @test */
    public function update_task_with_parent_id_as_null()
    {
        $taskToUpdate = $this->createTask(['parent_id' => $this->createTask()->id]); // Initially has a parent
        $response = $this->putJson("/api/tasks/{$taskToUpdate->id}", [
            'parent_id' => null,
        ]);
        $response->assertStatus(200)
                 ->assertJsonPath('data.parent_id', null);
    }

    /** @test */
    public function update_task_with_parent_id_as_its_own_id_fails()
    {
        $taskToUpdate = $this->createTask();
        $response = $this->putJson("/api/tasks/{$taskToUpdate->id}", [
            'parent_id' => $taskToUpdate->id,
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['parent_id']);
    }

    /** @test */
    public function update_task_with_non_existent_parent_id_fails()
    {
        $taskToUpdate = $this->createTask();
        $response = $this->putJson("/api/tasks/{$taskToUpdate->id}", [
            'parent_id' => 9999, // Non-existent ID
        ]);
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['parent_id']);
    }

    /** @test */
    public function update_task_parent_id_to_a_descendant_fails_circular_dependency()
    {
        $taskA = $this->createTask(['title' => 'Task A']); // Grandparent
        $taskB = $this->createTask(['title' => 'Task B', 'parent_id' => $taskA->id]); // Parent
        $taskC = $this->createTask(['title' => 'Task C', 'parent_id' => $taskB->id]); // Child

        // Try to set Task A's parent_id to Task C (its own descendant)
        $response = $this->putJson("/api/tasks/{$taskA->id}", [
            'parent_id' => $taskC->id,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['parent_id']);
    }

    /** @test */
    public function update_task_parent_id_to_a_direct_child_fails_circular_dependency()
    {
        $taskA = $this->createTask(['title' => 'Task A']); // Parent
        $taskB = $this->createTask(['title' => 'Task B', 'parent_id' => $taskA->id]); // Child

        // Try to set Task A's parent_id to Task B (its own child)
        $response = $this->putJson("/api/tasks/{$taskA->id}", [
            'parent_id' => $taskB->id,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['parent_id']);
    }
}

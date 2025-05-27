<?php

namespace Tests\Unit;

use App\Enums\TaskStatusEnum;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    private function createTask(array $attributes = []): Task
    {
        return Task::factory()->for($this->user)->create($attributes);
    }

    /** @test */
    public function has_not_done_child_returns_false_for_task_with_no_subtasks()
    {
        $task = $this->createTask();
        $this->assertFalse($task->hasNotDoneChild());
    }

    /** @test */
    public function has_not_done_child_returns_false_for_task_with_one_done_subtask()
    {
        $parentTask = $this->createTask();
        $this->createTask([
            'parent_id' => $parentTask->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);
        $this->assertFalse($parentTask->hasNotDoneChild());
    }

    /** @test */
    public function has_not_done_child_returns_true_for_task_with_one_pending_subtask()
    {
        $parentTask = $this->createTask();
        $this->createTask([
            'parent_id' => $parentTask->id,
            'status' => TaskStatusEnum::PENDING->value,
        ]);
        $this->assertTrue($parentTask->hasNotDoneChild());
    }

    /** @test */
    public function has_not_done_child_returns_false_for_task_with_multiple_done_subtasks()
    {
        $parentTask = $this->createTask();
        $this->createTask([
            'parent_id' => $parentTask->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);
        $this->createTask([
            'parent_id' => $parentTask->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);
        $this->assertFalse($parentTask->hasNotDoneChild());
    }

    /** @test */
    public function has_not_done_child_returns_true_for_task_with_multiple_subtasks_one_pending()
    {
        $parentTask = $this->createTask();
        $this->createTask([
            'parent_id' => $parentTask->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);
        $this->createTask([
            'parent_id' => $parentTask->id,
            'status' => TaskStatusEnum::PENDING->value,
        ]);
        $this->assertTrue($parentTask->hasNotDoneChild());
    }

    /** @test */
    public function has_not_done_child_returns_true_for_nested_subtask_pending()
    {
        $taskA = $this->createTask(); // Parent
        $taskB = $this->createTask([    // Child of A, DONE
            'parent_id' => $taskA->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);
        $this->createTask([            // Child of B, PENDING
            'parent_id' => $taskB->id,
            'status' => TaskStatusEnum::PENDING->value,
        ]);

        $this->assertTrue($taskA->hasNotDoneChild());
    }

    /** @test */
    public function has_not_done_child_returns_false_for_nested_subtasks_all_done()
    {
        $taskA = $this->createTask(); // Parent
        $taskB = $this->createTask([    // Child of A, DONE
            'parent_id' => $taskA->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);
        $this->createTask([            // Child of B, DONE
            'parent_id' => $taskB->id,
            'status' => TaskStatusEnum::DONE->value,
        ]);

        $this->assertFalse($taskA->hasNotDoneChild());
    }
}

<?php

namespace Tests\Feature;

use App\Enums\TaskSortEnum;
use App\Enums\TaskStatusEnum;
use App\Interfaces\Task\TaskRepositoryInterface;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class TaskRepositorySortingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private TaskRepositoryInterface $taskRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->taskRepository = $this->app->make(TaskRepositoryInterface::class);
    }

    private function createTask(array $attributes = []): Task
    {
        if (!isset($attributes['user_id'])) {
            $attributes['user_id'] = $this->user->id;
        }
        return Task::factory()->create($attributes);
    }

    /** @test */
    public function get_all_sorts_parent_tasks_and_their_subtasks_by_priority()
    {
        // Parent tasks
        $parent1 = $this->createTask(['priority' => 3, 'created_at' => now()->subDays(1)]); // P1
        $parent2 = $this->createTask(['priority' => 1, 'created_at' => now()->subDays(2)]); // P2
        $parent3 = $this->createTask(['priority' => 5, 'created_at' => now()->subDays(3)]); // P3

        // Subtasks for Parent 1
        $this->createTask(['parent_id' => $parent1->id, 'priority' => 2, 'user_id' => $parent1->user_id]); // S1.1
        $this->createTask(['parent_id' => $parent1->id, 'priority' => 4, 'user_id' => $parent1->user_id]); // S1.2

        // Subtasks for Parent 2
        $this->createTask(['parent_id' => $parent2->id, 'priority' => 1, 'user_id' => $parent2->user_id]); // S2.1

        // Test ASC
        $requestDataAsc = ['sort' => TaskSortEnum::PRIORITY->value, 'order' => 'asc'];
        $tasksAsc = $this->taskRepository->getAll($this->user, $requestDataAsc);

        $this->assertEquals([$parent2->id, $parent1->id, $parent3->id], $tasksAsc->pluck('id')->toArray());
        $parent1Asc = $tasksAsc->find($parent1->id);
        $this->assertEquals([2, 4], $parent1Asc->subtask->pluck('priority')->toArray());

        // Test DESC
        $requestDataDesc = ['sort' => TaskSortEnum::PRIORITY->value, 'order' => 'desc'];
        $tasksDesc = $this->taskRepository->getAll($this->user, $requestDataDesc);

        $this->assertEquals([$parent3->id, $parent1->id, $parent2->id], $tasksDesc->pluck('id')->toArray());
        $parent1Desc = $tasksDesc->find($parent1->id);
        $this->assertEquals([4, 2], $parent1Desc->subtask->pluck('priority')->toArray());
    }

    /** @test */
    public function get_all_sorts_parent_tasks_and_their_subtasks_by_created_at()
    {
        // Parent tasks
        $parent1 = $this->createTask(['priority' => 3, 'created_at' => now()->subDays(1)]); // P1 - latest
        $parent2 = $this->createTask(['priority' => 1, 'created_at' => now()->subDays(3)]); // P2 - oldest
        $parent3 = $this->createTask(['priority' => 5, 'created_at' => now()->subDays(2)]); // P3 - middle

        // Subtasks for Parent 1
        $this->createTask(['parent_id' => $parent1->id, 'created_at' => now()->subDays(1)->subHours(1), 'user_id' => $parent1->user_id]); // S1.1
        $this->createTask(['parent_id' => $parent1->id, 'created_at' => now()->subDays(1)->subHours(2), 'user_id' => $parent1->user_id]); // S1.2

        // Test ASC (oldest first)
        $requestDataAsc = ['sort' => TaskSortEnum::CREATED_AT->value, 'order' => 'asc'];
        $tasksAsc = $this->taskRepository->getAll($this->user, $requestDataAsc);
        $this->assertEquals([$parent2->id, $parent3->id, $parent1->id], $tasksAsc->pluck('id')->toArray());
        $parent1Asc = $tasksAsc->find($parent1->id);
        $this->assertEquals(
            [$parent1->subtask[1]->id, $parent1->subtask[0]->id], // oldest subtask first
            $parent1Asc->subtask->pluck('id')->toArray()
        );

        // Test DESC (newest first)
        $requestDataDesc = ['sort' => TaskSortEnum::CREATED_AT->value, 'order' => 'desc'];
        $tasksDesc = $this->taskRepository->getAll($this->user, $requestDataDesc);
        $this->assertEquals([$parent1->id, $parent3->id, $parent2->id], $tasksDesc->pluck('id')->toArray());
        $parent1Desc = $tasksDesc->find($parent1->id);
        $this->assertEquals(
            [$parent1->subtask[0]->id, $parent1->subtask[1]->id], // newest subtask first
            $parent1Desc->subtask->pluck('id')->toArray()
        );
    }

    /** @test */
    public function get_with_filter_sorts_filtered_tasks_and_subtasks()
    {
        $parent1 = $this->createTask(['title' => 'Alpha Task', 'status' => TaskStatusEnum::PENDING->value, 'priority' => 2]);
        $this->createTask(['parent_id' => $parent1->id, 'title' => 'Sub Alpha 1', 'priority' => 3, 'user_id' => $parent1->user_id]);
        $this->createTask(['parent_id' => $parent1->id, 'title' => 'Sub Alpha 2', 'priority' => 1, 'user_id' => $parent1->user_id]);

        $parent2 = $this->createTask(['title' => 'Beta Task', 'status' => TaskStatusEnum::PENDING->value, 'priority' => 1]);
        $this->createTask(['parent_id' => $parent2->id, 'title' => 'Sub Beta 1', 'priority' => 2, 'user_id' => $parent2->user_id]);

        // Another status to ensure filter works
        $this->createTask(['title' => 'Gamma Task', 'status' => TaskStatusEnum::DONE->value, 'priority' => 3]);

        $request = new Request([
            'status' => TaskStatusEnum::PENDING->value,
            'sort' => TaskSortEnum::PRIORITY->value,
            'order' => 'asc', // Sort by priority: parent2 (1), then parent1 (2)
        ]);

        $tasks = $this->taskRepository->getWithFilter($this->user, $request);

        $this->assertCount(2, $tasks);
        $this->assertEquals([$parent2->id, $parent1->id], $tasks->pluck('id')->toArray());

        // Check subtask sorting for parent1
        $filteredParent1 = $tasks->find($parent1->id);
        $this->assertNotNull($filteredParent1);
        $this->assertCount(2, $filteredParent1->subtask);
        $this->assertEquals([1, 3], $filteredParent1->subtask->pluck('priority')->toArray());
    }

     /** @test */
    public function get_all_loads_subtasks_when_no_sort_is_specified()
    {
        $parent = $this->createTask();
        $this->createTask(['parent_id' => $parent->id, 'user_id' => $parent->user_id]);

        $tasks = $this->taskRepository->getAll($this->user, []);
        $this->assertTrue($tasks->first()->relationLoaded('subtask'));
        $this->assertCount(1, $tasks->first()->subtask);
    }

    /** @test */
    public function get_with_filter_loads_subtasks_when_no_sort_is_specified()
    {
        $parent = $this->createTask(['title' => 'Filter Me']);
        $this->createTask(['parent_id' => $parent->id, 'user_id' => $parent->user_id]);

        $request = new Request(['title' => 'Filter Me']);
        $tasks = $this->taskRepository->getWithFilter($this->user, $request);

        $this->assertCount(1, $tasks);
        $this->assertTrue($tasks->first()->relationLoaded('subtask'));
        $this->assertCount(1, $tasks->first()->subtask);
    }
}

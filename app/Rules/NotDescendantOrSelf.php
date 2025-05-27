<?php

namespace App\Rules;

use App\Models\Task;
use Illuminate\Contracts\Validation\Rule;

class NotDescendantOrSelf implements Rule
{
    protected $currentTaskId;

    /**
     * Create a new rule instance.
     *
     * @param int $currentTaskId The ID of the task being updated.
     * @return void
     */
    public function __construct($currentTaskId)
    {
        $this->currentTaskId = $currentTaskId;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value  The potential parent_id
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (is_null($value)) {
            return true; // Null parent_id is allowed
        }

        // Ensure $value is treated as an integer for comparison
        $potentialParentId = (int) $value;
        
        // 1. Check if the potential parent_id is the current task itself.
        if ($potentialParentId === $this->currentTaskId) {
            return false; // Task cannot be its own parent.
        }

        // 2. Check for circular dependency: potential parent cannot be a descendant of the current task.
        // We need to traverse UP from the potential_parent_id to see if we hit currentTaskId.
        $ancestorId = $potentialParentId;
        while ($ancestorId !== null) {
            $task = Task::find($ancestorId);

            if (!$task) {
                // This case should ideally be caught by 'exists:tasks,id' rule first,
                // but as a safeguard, if the task doesn't exist, it's not a valid parent.
                return false; 
            }

            // If the ancestor's parent_id is the current task ID, it's a circular dependency.
            if ($task->parent_id === $this->currentTaskId) {
                return false;
            }
            
            // If this ancestor IS the current task, it implies the potential parent is a child of current task.
            // This check is slightly different from the one above.
            // Example: Task A (current). Task B is child of A. Task C is child of B.
            // If we try to set A's parent to C:
            // currentTaskId = A. potentialParentId = C.
            // Loop 1: ancestorId = C. task = C. parent_id = B. Not A.
            // Loop 2: ancestorId = B. task = B. parent_id = A. This IS A. So, C is a descendant of A. Fail.
            if ($task->id === $this->currentTaskId && $potentialParentId !== $this->currentTaskId) {
                 // This check is redundant if the above ($task->parent_id === $this->currentTaskId) is hit correctly
                 // And the initial self-check ($potentialParentId === $this->currentTaskId) handles the direct case.
                 // Let's refine the loop condition. We are checking if $potentialParentId is a descendant of $currentTaskId
                 // This means, if we go up from $potentialParentId, we should NOT hit $currentTaskId as a PARENT.
                 // The current logic is: if $potentialParentId's ancestor has $currentTaskId as a parent, then fail.
                 // This is actually checking if $currentTaskId is an ancestor of $potentialParentId.
                 // This is correct for preventing $currentTaskId from being moved under one of its own children.
            }


            if (is_null($task->parent_id)) {
                break; // Reached a top-level task
            }
            
            // Check for infinite loop if data is corrupted (e.g. task parent_id refers to itself directly in DB)
            if ($ancestorId === $task->parent_id) {
                return false; // Data integrity issue, invalid parent
            }

            $ancestorId = $task->parent_id;
        }

        return true; // No circular dependency found
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The selected parent task cannot be the current task or one of its descendants.';
    }
}

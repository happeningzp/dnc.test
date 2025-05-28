import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskItem from './TaskItem'; // Assuming TaskItem.jsx is in the same directory or correct path
import { TaskStatusEnum } from '../Enums/TaskStatusEnum'; // Adjust path as necessary

describe('TaskItem', () => {
  const mockTaskPending = {
    id: 1,
    title: 'Test Task Pending',
    description: 'This is a pending task description.',
    priority: 3,
    status: TaskStatusEnum.PENDING.value,
    subtask: [],
    completed_at: null,
  };

  const mockTaskDone = {
    id: 2,
    title: 'Test Task Done',
    description: 'This is a completed task description.',
    priority: 1,
    status: TaskStatusEnum.DONE.value,
    completed_at: '2023-01-01T10:00:00Z',
    subtask: [
      {
        id: 3,
        title: 'Subtask 1 for Done Task',
        description: 'Subtask description.',
        priority: 2,
        status: TaskStatusEnum.DONE.value,
        completed_at: '2023-01-01T09:00:00Z',
        subtask: [],
      }
    ],
  };

  it('renders task details correctly for a pending task', () => {
    render(<TaskItem task={mockTaskPending} />);
    expect(screen.getByText(mockTaskPending.title)).toBeInTheDocument();
    expect(screen.getByText(mockTaskPending.description)).toBeInTheDocument();
    expect(screen.getByText(/Priority: Medium/i)).toBeInTheDocument(); // Priority 3 is Medium
    expect(screen.getByText(/Status: Pending/i)).toBeInTheDocument();
    // Completed_at should not be rendered for pending task
    expect(screen.queryByText(/Completed:/i)).not.toBeInTheDocument();
  });

  it('renders task details correctly for a done task', () => {
    render(<TaskItem task={mockTaskDone} />);
    expect(screen.getByText(mockTaskDone.title)).toBeInTheDocument();
    expect(screen.getByText(mockTaskDone.description)).toBeInTheDocument();
    expect(screen.getByText(/Priority: Low/i)).toBeInTheDocument(); // Priority 1 is Low
    expect(screen.getByText(/Status: Done/i)).toBeInTheDocument();
    expect(screen.getByText(/Completed: 1\/1\/2023/i)).toBeInTheDocument(); // Check for date part
  });

  it('renders subtasks recursively', () => {
    render(<TaskItem task={mockTaskDone} />);
    // Check if the parent task is rendered
    expect(screen.getByText(mockTaskDone.title)).toBeInTheDocument();
    // Check if the subtask title is rendered
    expect(screen.getByText('Subtask 1 for Done Task')).toBeInTheDocument();
    // Check subtask status
    expect(screen.getAllByText(/Status: Done/i).length).toBeGreaterThanOrEqual(2); // Parent + subtask
  });

  it('calls onStartEdit when Edit button is clicked', () => {
    const handleStartEdit = vi.fn();
    render(<TaskItem task={mockTaskPending} onStartEdit={handleStartEdit} />);
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);
    
    expect(handleStartEdit).toHaveBeenCalledTimes(1);
    expect(handleStartEdit).toHaveBeenCalledWith(mockTaskPending);
  });

  it('calls onDeleteTask when Delete button is clicked', () => {
    const handleDeleteTask = vi.fn();
    render(<TaskItem task={mockTaskPending} onDeleteTask={handleDeleteTask} />);
    
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    
    expect(handleDeleteTask).toHaveBeenCalledTimes(1);
    expect(handleDeleteTask).toHaveBeenCalledWith(mockTaskPending.id);
  });

  it('calls onMarkTaskDone when "Mark as Done" button is clicked for a pending task', () => {
    const handleMarkTaskDone = vi.fn();
    render(<TaskItem task={mockTaskPending} onMarkTaskDone={handleMarkTaskDone} />);
    
    const markDoneButton = screen.getByRole('button', { name: /mark as done/i });
    fireEvent.click(markDoneButton);
    
    expect(handleMarkTaskDone).toHaveBeenCalledTimes(1);
    expect(handleMarkTaskDone).toHaveBeenCalledWith(mockTaskPending.id);
  });

  it('does not render "Mark as Done" button for a completed task', () => {
    render(<TaskItem task={mockTaskDone} />);
    expect(screen.queryByRole('button', { name: /mark as done/i })).not.toBeInTheDocument();
  });
});

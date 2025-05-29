import React, { useState } from 'react';
// Removed useNavigate and useAuth as they are no longer used directly here.
import { deleteTask as deleteTaskService, markTaskDone as markTaskDoneService } from '../services/taskService';
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import EditTaskForm from '../components/EditTaskForm';

const DashboardPage = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [taskListRefreshKey, setTaskListRefreshKey] = useState(0); 

    // Base button classes (consistent with other forms)
    const baseButtonClasses = "inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-150";
    // Primary (Green)
    const primaryButtonClasses = `${baseButtonClasses} text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`;


    const handleTaskCreated = (newTask) => {
        console.log('New task created:', newTask);
        setShowCreateForm(false);
        setTaskListRefreshKey(prevKey => prevKey + 1);
    };

    const handleStartEdit = (task) => {
        setEditingTask(task);
        setShowEditForm(true);
        setShowCreateForm(false);
    };

    const handleTaskUpdated = (updatedTask) => {
        console.log('Task updated:', updatedTask);
        setShowEditForm(false);
        setEditingTask(null);
        setTaskListRefreshKey(prevKey => prevKey + 1);
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setEditingTask(null);
    };

    const handleDeleteTask = async (taskId) => {
        if (editingTask && editingTask.id === taskId) {
            handleCancelEdit();
        }
        if (showCreateForm) {
            setShowCreateForm(false);
        }

        if (window.confirm('Are you sure you want to delete this task? This may also delete its subtasks if the backend is configured that way.')) {
            try {
                await deleteTaskService(taskId);
                console.log(`Task ${taskId} deleted successfully.`);
                setTaskListRefreshKey(prevKey => prevKey + 1);
            } catch (error) {
                console.error(`Error deleting task ${taskId}:`, error);
                alert(`Failed to delete task: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handleMarkTaskDone = async (taskId) => {
        try {
            await markTaskDoneService(taskId);
            console.log(`Task ${taskId} marked as done.`);
            setTaskListRefreshKey(prevKey => prevKey + 1);
            if (editingTask && editingTask.id === taskId) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error(`Error marking task ${taskId} as done:`, error);
            alert(`Failed to mark task as done: ${error.message || 'Unknown error'}`);
        }
    };

    return (
        <div className="py-2"> {/* Added small py for overall page spacing within main container */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8"> {/* mb-8 for more space */}
                <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
                {!showCreateForm && !showEditForm && (
                    <button 
                        onClick={() => { setShowCreateForm(true); setShowEditForm(false); setEditingTask(null); }}
                        className={`${primaryButtonClasses} mt-4 sm:mt-0`} // Use defined primary button, add margin for mobile
                    >
                        Add New Task
                    </button>
                )}
            </div>
            
            {showCreateForm && (
                <CreateTaskForm 
                    onTaskCreated={handleTaskCreated}
                    onCancel={() => setShowCreateForm(false)}
                />
            )}

            {showEditForm && editingTask && (
                <EditTaskForm
                    taskToEdit={editingTask}
                    onTaskUpdated={handleTaskUpdated}
                    onCancelEdit={handleCancelEdit}
                />
            )}
            
            {/* Conditionally render hr if a form was shown, or always if preferred */}
            {(showCreateForm || showEditForm) && <hr className="my-8 border-gray-300"/>}
            
            <TaskList 
                key={taskListRefreshKey} 
                onStartEdit={handleStartEdit}
                onDeleteTask={handleDeleteTask}
                onMarkTaskDone={handleMarkTaskDone}
            /> 
        </div>
    );
};

export default DashboardPage;

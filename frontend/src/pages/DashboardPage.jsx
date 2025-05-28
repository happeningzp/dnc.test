import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logout as logoutService } from '../services/authService';
import { deleteTask as deleteTaskService, markTaskDone as markTaskDoneService } from '../services/taskService'; // Import markTaskDone
import TaskList from '../components/TaskList';
import CreateTaskForm from '../components/CreateTaskForm';
import EditTaskForm from '../components/EditTaskForm';

const DashboardPage = () => {
    const { user, logoutContext } = useAuth();
    const navigate = useNavigate();
    
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [taskListRefreshKey, setTaskListRefreshKey] = useState(0); 

    const handleLogout = async () => {
        try {
            await logoutService();
            logoutContext();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            logoutContext();
            navigate('/login');
        }
    };

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
            setTaskListRefreshKey(prevKey => prevKey + 1); // Refresh the task list
            // If currently editing this task, close the edit form as its status has changed
            if (editingTask && editingTask.id === taskId) {
                handleCancelEdit();
            }
        } catch (error) {
            console.error(`Error marking task ${taskId} as done:`, error);
            // Display specific error from backend if available (e.g., "You must complete all child tasks.")
            alert(`Failed to mark task as done: ${error.message || 'Unknown error'}`);
        }
    };

    if (!user) {
        return <p>Loading user data or not logged in...</p>;
    }

    return (
        <div>
            <h1>User Dashboard</h1>
            <p>Welcome, {user.name || user.email}!</p>
            <button onClick={handleLogout} style={{ marginRight: '10px' }}>Logout</button>
            
            {!showCreateForm && !showEditForm && (
                <button onClick={() => { setShowCreateForm(true); setShowEditForm(false); setEditingTask(null); }}>
                    Add New Task
                </button>
            )}

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
            
            <hr style={{ margin: '20px 0' }}/>
            <TaskList 
                key={taskListRefreshKey} 
                onStartEdit={handleStartEdit}
                onDeleteTask={handleDeleteTask}
                onMarkTaskDone={handleMarkTaskDone} // Pass handleMarkTaskDone to TaskList
            /> 
        </div>
    );
};

export default DashboardPage;

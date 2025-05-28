import apiClient from './api';

/**
 * Fetches tasks from the API.
 * @param {object} params - Optional query parameters for filtering, sorting, etc.
 *                          Example: { sort: 'priority', order: 'desc', status: 1 }
 * @returns {Promise<Array>} A promise that resolves to an array of tasks.
 * @throws {Error} If the API request fails.
 */
export const getTasks = async (params = {}) => {
    try {
        // The apiClient is already configured with an interceptor to send the token.
        // So, no need to manually add the token here.
        const response = await apiClient.get('/tasks', { params });
        // Assuming the backend returns tasks directly in response.data
        // Or if it's paginated, it might be response.data.data
        return response.data.data || response.data; // Adjust based on your API's response structure
    } catch (error) {
        console.error('Error fetching tasks:', error.response ? error.response.data : error.message);
        // Re-throw the error to be caught by the calling component
        throw error.response ? error.response.data : new Error('Failed to fetch tasks');
    }
};

export const createTask = async (taskData) => {
    try {
        // Ensure parent_id is null if it's an empty string or not provided,
        // as the backend expects an integer or null.
        const dataToSend = {
            ...taskData,
            parent_id: taskData.parent_id || null, 
        };
        const response = await apiClient.post('/tasks', dataToSend);
        // Assuming the API returns the created task object directly in response.data
        // or response.data.data if nested under a 'data' key
        return response.data.data || response.data;
    } catch (error) {
        console.error('Error creating task:', error.response ? error.response.data : error.message);
        // Re-throw a structured error or the specific error message from backend
        if (error.response && error.response.data) {
            // If backend sends validation errors (e.g. { errors: { title: [...] } })
            if (error.response.data.errors) {
                throw { message: "Validation failed", errors: error.response.data.errors };
            }
            // If backend sends a single message (e.g. { message: "Error" })
            if (error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error.response.data; // Fallback to throwing the whole data object
        }
        throw new Error('Failed to create task');
    }
};

export const getTask = async (taskId) => {
    try {
        const response = await apiClient.get(`/tasks/${taskId}`);
        return response.data.data || response.data; // Adjust based on your API's response structure
    } catch (error) {
        console.error(`Error fetching task ${taskId}:`, error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw new Error(`Failed to fetch task ${taskId}`);
    }
};

export const updateTask = async (taskId, taskData) => {
    try {
        // Ensure parent_id is null if it's an empty string.
        // Backend expects an integer or null.
        const dataToSend = {
            ...taskData,
            parent_id: taskData.parent_id === '' ? null : taskData.parent_id,
        };
        const response = await apiClient.put(`/tasks/${taskId}`, dataToSend);
        return response.data.data || response.data; // Adjust based on API response
    } catch (error) {
        console.error(`Error updating task ${taskId}:`, error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            if (error.response.data.errors) {
                throw { message: "Validation failed", errors: error.response.data.errors };
            }
            if (error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error.response.data;
        }
        throw new Error(`Failed to update task ${taskId}`);
    }
};

export const deleteTask = async (taskId) => {
    try {
        const response = await apiClient.delete(`/tasks/${taskId}`);
        // DELETE requests often return 204 No Content on success,
        // or sometimes the deleted resource or a success message.
        // If 204, response.data might be undefined or null.
        return response.data; // Or handle based on actual API (e.g., return true or response.status)
    } catch (error) {
        console.error(`Error deleting task ${taskId}:`, error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            if (error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error.response.data;
        }
        throw new Error(`Failed to delete task ${taskId}`);
    }
};

export const markTaskDone = async (taskId) => {
    try {
        // Using PUT as specified in the task description for the /done endpoint
        const response = await apiClient.put(`/tasks/${taskId}/done`); 
        return response.data.data || response.data; // Adjust based on API response
    } catch (error) {
        console.error(`Error marking task ${taskId} as done:`, error.response ? error.response.data : error.message);
        if (error.response && error.response.data) {
            // Handle specific error messages from backend (e.g., "You must complete all child tasks.")
            if (error.response.data.message) {
                throw new Error(error.response.data.message);
            }
            throw error.response.data;
        }
        throw new Error(`Failed to mark task ${taskId} as done`);
    }
};

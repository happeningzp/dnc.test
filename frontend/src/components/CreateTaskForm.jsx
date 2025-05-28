import React, { useState } from 'react';
import { createTask } from '../services/taskService';

const PRIORITY_OPTIONS = [
    { value: '1', label: '1 (Low)' },
    { value: '2', label: '2' },
    { value: '3', label: '3 (Medium)' },
    { value: '4', label: '4' },
    { value: '5', label: '5 (High)' },
];

const CreateTaskForm = ({ onTaskCreated, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('3'); // Default to Medium
    const [parentId, setParentId] = useState('');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const commonInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const commonLabelClasses = "block text-sm font-medium text-gray-700";
    const commonErrorClasses = "text-xs text-red-600 mt-1";
    const commonButtonClasses = "py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
    const primaryButtonClasses = "text-white bg-indigo-600 hover:bg-indigo-700";
    const secondaryButtonClasses = "text-gray-700 bg-gray-200 hover:bg-gray-300";


    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('3');
        setParentId('');
        setError('');
        setValidationErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});

        if (!title.trim()) {
            setValidationErrors(prev => ({ ...prev, title: 'Title is required.' }));
            return;
        }
        if (!priority) {
            setValidationErrors(prev => ({ ...prev, priority: 'Priority is required.' }));
            return;
        }

        setLoading(true);
        try {
            const taskData = {
                title: title.trim(),
                description: description.trim() || null,
                priority: parseInt(priority, 10),
                parent_id: parentId ? parseInt(parentId, 10) : null,
            };
            const newTask = await createTask(taskData);
            resetForm();
            if (onTaskCreated) {
                onTaskCreated(newTask);
            }
        } catch (err) {
            console.error('Error creating task:', err);
            if (err.errors && typeof err.errors === 'object') {
                const backendErrors = {};
                for (const field in err.errors) {
                    backendErrors[field] = err.errors[field].join(' ');
                }
                setValidationErrors(backendErrors);
                setError('Please correct the validation errors below.');
            } else {
                setError(err.message || 'Failed to create task. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 my-4 bg-white rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Create New Task</h3>
            {error && !Object.keys(validationErrors).length && <p className={`mb-4 text-sm ${validationErrors ? 'text-red-600' : 'text-gray-600'}`}>{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="task-title" className={`${commonLabelClasses}`}>
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="task-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={commonInputClasses}
                    />
                    {validationErrors.title && <p className={commonErrorClasses}>{validationErrors.title}</p>}
                </div>
                <div>
                    <label htmlFor="task-description" className={commonLabelClasses}>
                        Description
                    </label>
                    <textarea
                        id="task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className={commonInputClasses}
                    />
                    {validationErrors.description && <p className={commonErrorClasses}>{validationErrors.description}</p>}
                </div>
                <div>
                    <label htmlFor="task-priority" className={`${commonLabelClasses}`}>
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <select 
                        id="task-priority" 
                        value={priority} 
                        onChange={(e) => setPriority(e.target.value)}
                        className={commonInputClasses}
                    >
                        {PRIORITY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {validationErrors.priority && <p className={commonErrorClasses}>{validationErrors.priority}</p>}
                </div>
                <div>
                    <label htmlFor="task-parent-id" className={commonLabelClasses}>
                        Parent Task ID (Optional)
                    </label>
                    <input
                        type="number"
                        id="task-parent-id"
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        placeholder="Enter ID of parent task"
                        className={commonInputClasses}
                    />
                    {validationErrors.parent_id && <p className={commonErrorClasses}>{validationErrors.parent_id}</p>}
                </div>
                <div className="flex items-center justify-end space-x-3 pt-2">
                    {onCancel && (
                        <button 
                            type="button" 
                            onClick={onCancel} 
                            disabled={loading}
                            className={`${commonButtonClasses} ${secondaryButtonClasses}`}
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`${commonButtonClasses} ${primaryButtonClasses}`}
                    >
                        {loading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTaskForm;

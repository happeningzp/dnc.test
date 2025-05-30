import React, { useState, useEffect } from 'react';
import { updateTask } from '../services/taskService';

const PRIORITY_OPTIONS = [
    { value: '1', label: '1 (Low)' },
    { value: '2', label: '2' },
    { value: '3', label: '3 (Medium)' },
    { value: '4', label: '4' },
    { value: '5', label: '5 (High)' },
];

const STATUS_OPTIONS = [
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Done' },
];

const EditTaskForm = ({ taskToEdit, onTaskUpdated, onCancelEdit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('3');
    const [parentId, setParentId] = useState('');
    const [status, setStatus] = useState('0');
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Consistent styling classes (as defined in CreateTaskForm)
    const commonInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm";
    const commonLabelClasses = "block text-sm font-medium text-gray-700";
    const commonErrorClasses = "text-xs text-red-600 mt-1";
    
    const baseButtonClasses = "inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors duration-150";
    const primaryButtonClasses = `${baseButtonClasses} text-white bg-green-600 hover:bg-green-700 focus:ring-green-500`; // Green primary
    const secondaryButtonClasses = `${baseButtonClasses} text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400`; // Gray secondary

    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || '');
            setDescription(taskToEdit.description || '');
            setPriority(taskToEdit.priority?.toString() || '3');
            setParentId(taskToEdit.parent_id?.toString() || '');
            setStatus(taskToEdit.status?.toString() || '0');
            setError('');
            setValidationErrors({});
        }
    }, [taskToEdit]);

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
        if (!status) {
            setValidationErrors(prev => ({ ...prev, status: 'Status is required.' }));
            return;
        }
        
        setLoading(true);
        try {
            const updatedTaskData = {
                title: title.trim(),
                description: description.trim() || null,
                priority: parseInt(priority, 10),
                parent_id: parentId ? parseInt(parentId, 10) : null,
                status: parseInt(status, 10),
            };
            
            if (taskToEdit && updatedTaskData.parent_id === taskToEdit.id) {
                 setValidationErrors(prev => ({ ...prev, parent_id: 'Task cannot be its own parent.' }));
                 setLoading(false);
                 return;
            }

            const updatedTask = await updateTask(taskToEdit.id, updatedTaskData);
            if (onTaskUpdated) {
                onTaskUpdated(updatedTask);
            }
        } catch (err) {
            console.error('Error updating task:', err);
            if (err.errors && typeof err.errors === 'object') {
                const backendErrors = {};
                for (const field in err.errors) {
                    backendErrors[field] = err.errors[field].join(' ');
                }
                setValidationErrors(backendErrors);
                setError('Please correct the validation errors below.');
            } else {
                setError(err.message || 'Failed to update task. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!taskToEdit) return null;

    return (
        <div className="p-6 my-4 bg-white rounded-lg shadow border border-gray-200"> {/* Light border, consistent with CreateTaskForm */}
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Edit Task: <span className="font-normal italic text-gray-600">{taskToEdit.title}</span></h3>
            {error && !Object.keys(validationErrors).length && <p className={`mb-4 text-sm text-red-600`}>{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased space-y */}
                <div>
                    <label htmlFor="edit-task-title" className={`${commonLabelClasses}`}>
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="edit-task-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={commonInputClasses}
                    />
                    {validationErrors.title && <p className={commonErrorClasses}>{validationErrors.title}</p>}
                </div>
                <div>
                    <label htmlFor="edit-task-description" className={commonLabelClasses}>
                        Description
                    </label>
                    <textarea
                        id="edit-task-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        className={commonInputClasses}
                    />
                     {validationErrors.description && <p className={commonErrorClasses}>{validationErrors.description}</p>}
                </div>
                <div>
                    <label htmlFor="edit-task-priority" className={`${commonLabelClasses}`}>
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <select 
                        id="edit-task-priority" 
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
                    <label htmlFor="edit-task-status" className={`${commonLabelClasses}`}>
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select 
                        id="edit-task-status" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className={commonInputClasses}
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    {validationErrors.status && <p className={commonErrorClasses}>{validationErrors.status}</p>}
                </div>
                <div>
                    <label htmlFor="edit-task-parent-id" className={commonLabelClasses}>
                        Parent Task ID (Optional)
                    </label>
                    <input
                        type="number"
                        id="edit-task-parent-id"
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        placeholder="Enter ID of parent task"
                        className={commonInputClasses}
                    />
                    {validationErrors.parent_id && <p className={commonErrorClasses}>{validationErrors.parent_id}</p>}
                </div>
                <div className="flex items-center justify-end space-x-3 pt-3"> {/* Increased pt */}
                    <button 
                        type="button" 
                        onClick={onCancelEdit} 
                        disabled={loading}
                        className={secondaryButtonClasses} // Use new secondary button style
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={primaryButtonClasses} // Use new primary button style
                    >
                        {loading ? 'Updating...' : 'Update Task'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTaskForm;

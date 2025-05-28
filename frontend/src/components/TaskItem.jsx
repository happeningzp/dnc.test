import React from 'react';

const TaskItem = ({ task, onStartEdit, onDeleteTask, onMarkTaskDone }) => {
    const taskStatusMap = {
        0: { text: 'Pending', bg: 'bg-yellow-100', textClr: 'text-yellow-800', borderClr: 'border-yellow-300' },
        1: { text: 'Done', bg: 'bg-green-100', textClr: 'text-green-800', borderClr: 'border-green-300' },
    };

    const priorityTextMap = {
        1: 'Low', 2: 'Medium-Low', 3: 'Medium', 4: 'Medium-High', 5: 'High'
    };
    const priorityColorMap = {
        1: 'bg-blue-100 text-blue-800',
        2: 'bg-sky-100 text-sky-800',
        3: 'bg-indigo-100 text-indigo-800',
        4: 'bg-purple-100 text-purple-800',
        5: 'bg-pink-100 text-pink-800',
    };


    const getPriorityText = (priority) => priorityTextMap[priority] || 'Unknown';
    const getPriorityClasses = (priority) => priorityColorMap[priority] || 'bg-gray-100 text-gray-800';

    const currentStatus = taskStatusMap[task.status] || { text: 'Unknown', bg: 'bg-gray-100', textClr: 'text-gray-800', borderClr: 'border-gray-300' };
    const isTaskDone = task.status === 1;

    const handleEditClick = () => onStartEdit && onStartEdit(task);
    const handleDeleteClick = () => onDeleteTask && onDeleteTask(task.id);
    const handleMarkDoneClick = () => onMarkTaskDone && onMarkTaskDone(task.id);

    const buttonBaseClasses = "px-3 py-1 text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1";
    const editButtonClasses = "text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-400";
    const deleteButtonClasses = "text-white bg-red-500 hover:bg-red-600 focus:ring-red-400";
    const markDoneButtonClasses = "text-white bg-green-500 hover:bg-green-600 focus:ring-green-400";

    return (
        <div 
            className={`p-4 border rounded-lg shadow-sm ${currentStatus.bg} ${currentStatus.borderClr} ${isTaskDone ? 'opacity-75' : ''}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h4 className={`text-lg font-semibold ${currentStatus.textClr} ${isTaskDone ? 'line-through' : ''}`}>
                    {task.title}
                </h4>
                <div className="flex space-x-2 flex-shrink-0">
                    {!isTaskDone && onMarkTaskDone && (
                        <button onClick={handleMarkDoneClick} className={`${buttonBaseClasses} ${markDoneButtonClasses}`}>
                            Mark Done
                        </button>
                    )}
                    {onStartEdit && (
                        <button onClick={handleEditClick} className={`${buttonBaseClasses} ${editButtonClasses}`}>
                            Edit
                        </button>
                    )}
                    {onDeleteTask && (
                        <button onClick={handleDeleteClick} className={`${buttonBaseClasses} ${deleteButtonClasses}`}>
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {task.description && (
                <p className={`text-sm text-gray-600 mb-2 ${isTaskDone ? 'line-through' : ''}`}>
                    {task.description}
                </p>
            )}

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityClasses(task.priority)}`}>
                    Priority: {getPriorityText(task.priority)}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.textClr} border ${currentStatus.borderClr}`}>
                    Status: {currentStatus.text}
                </span>
                {task.completed_at && isTaskDone && (
                    <span className="text-gray-500">
                        Completed: {new Date(task.completed_at).toLocaleDateString()}
                    </span>
                )}
            </div>

            {task.subtask && task.subtask.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 pl-4">
                    <h5 className="text-sm font-semibold text-gray-600 mb-2">Sub-tasks:</h5>
                    <div className="space-y-3">
                        {task.subtask.map(sub => (
                            <TaskItem 
                                key={sub.id} 
                                task={sub} 
                                onStartEdit={onStartEdit} 
                                onDeleteTask={onDeleteTask}
                                onMarkTaskDone={onMarkTaskDone}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskItem;

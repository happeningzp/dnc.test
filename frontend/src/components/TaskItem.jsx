import React from 'react';

const TaskItem = ({ task, onStartEdit, onDeleteTask, onMarkTaskDone }) => {
    const taskStatusMap = {
        0: { text: 'Pending', badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-800', itemBg: 'bg-white' },
        1: { text: 'Done', badgeBg: 'bg-green-100', badgeText: 'text-green-800', itemBg: 'bg-green-50' }, // Slightly different bg for done item
    };

    const priorityTextMap = {
        1: 'Low', 2: 'Medium-Low', 3: 'Medium', 4: 'Medium-High', 5: 'High'
    };
    // Using more subtle, light-toned badges for priority
    const priorityColorMap = {
        1: 'bg-sky-100 text-sky-700',
        2: 'bg-blue-100 text-blue-700',
        3: 'bg-indigo-100 text-indigo-700',
        4: 'bg-purple-100 text-purple-700',
        5: 'bg-pink-100 text-pink-700',
    };

    const getPriorityText = (priority) => priorityTextMap[priority] || 'Unknown';
    const getPriorityClasses = (priority) => priorityColorMap[priority] || 'bg-gray-100 text-gray-700';

    const currentStatusInfo = taskStatusMap[task.status] || { text: 'Unknown', badgeBg: 'bg-gray-100', badgeText: 'text-gray-700', itemBg: 'bg-white' };
    const isTaskDone = task.status === 1;

    const handleEditClick = () => onStartEdit && onStartEdit(task);
    const handleDeleteClick = () => onDeleteTask && onDeleteTask(task.id);
    const handleMarkDoneClick = () => onMarkTaskDone && onMarkTaskDone(task.id);

    // Updated Button Styles
    const baseButtonClasses = "px-3 py-1 text-xs font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors duration-150";
    
    // Primary (Green) for Mark as Done
    const markDoneButtonClasses = `${baseButtonClasses} text-white bg-green-500 hover:bg-green-600 focus:ring-green-500`;
    // Secondary (Gray) for Edit and Delete
    const secondaryButtonClasses = `${baseButtonClasses} text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-gray-400`;
    // Optional: A more distinct danger style for delete if preferred over plain gray
    // const dangerButtonClasses = `${baseButtonClasses} text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500`;


    return (
        <div 
            className={`p-4 border border-gray-200 rounded-lg shadow-sm ${currentStatusInfo.itemBg} ${isTaskDone ? 'opacity-80' : ''}`}
        >
            <div className="flex justify-between items-start mb-3">
                <h4 className={`text-lg font-semibold text-gray-800 ${isTaskDone ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                </h4>
                <div className="flex space-x-2 flex-shrink-0">
                    {!isTaskDone && onMarkTaskDone && (
                        <button onClick={handleMarkDoneClick} className={markDoneButtonClasses}>
                            Mark Done
                        </button>
                    )}
                    {onStartEdit && (
                        <button onClick={handleEditClick} className={secondaryButtonClasses}> {/* Changed to secondary */}
                            Edit
                        </button>
                    )}
                    {onDeleteTask && (
                        <button onClick={handleDeleteClick} className={secondaryButtonClasses}> {/* Changed to secondary, or use dangerButtonClasses */}
                            Delete
                        </button>
                    )}
                </div>
            </div>

            {task.description && (
                <p className={`text-sm text-gray-600 mb-3 ${isTaskDone ? 'line-through text-gray-500' : ''}`}>
                    {task.description}
                </p>
            )}

            <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs items-center">
                <span className={`px-2.5 py-1 rounded-full font-medium ${getPriorityClasses(task.priority)}`}>
                    Priority: {getPriorityText(task.priority)}
                </span>
                <span className={`px-2.5 py-1 rounded-full font-medium ${currentStatusInfo.badgeBg} ${currentStatusInfo.badgeText}`}>
                    Status: {currentStatusInfo.text}
                </span>
                {task.completed_at && isTaskDone && (
                    <span className="text-gray-500 text-xs">
                        Completed: {new Date(task.completed_at).toLocaleDateString()}
                    </span>
                )}
            </div>

            {task.subtask && task.subtask.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200 pl-4 space-y-3"> {/* Added space-y-3 for subtasks */}
                    <h5 className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Sub-tasks:</h5>
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
            )}
        </div>
    );
};

export default TaskItem;

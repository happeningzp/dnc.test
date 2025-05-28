import React, { useState, useEffect, useCallback } from 'react';
import { getTasks } from '../services/taskService';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import TaskSort from './TaskSort';

const TaskList = ({ onStartEdit, onDeleteTask, onMarkTaskDone }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        title: '',
        status: '',
        priority_from: '',
        priority_to: '',
    });
    const [sortCriteria, setSortCriteria] = useState({
        sortBy: 'created_at',
        order: 'desc',
    });

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            const activeFilters = {};
            for (const key in filters) {
                if (filters[key] !== null && filters[key] !== '') {
                    activeFilters[key] = filters[key];
                }
            }

            const apiParams = {
                ...activeFilters,
                sort: sortCriteria.sortBy,
                order: sortCriteria.order,
            };
            
            const fetchedTasks = await getTasks(apiParams);
            setTasks(fetchedTasks);
            setError(null);
        } catch (err) {
            console.error("Error fetching tasks in component:", err);
            setError(err.message || 'Failed to fetch tasks.');
        } finally {
            setLoading(false);
        }
    }, [filters, sortCriteria]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleFilterChange = (newFilters) => {
        setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    };
    
    const handleClearFiltersInParent = () => {
        setFilters({
            title: '',
            status: '',
            priority_from: '',
            priority_to: '',
        });
    };

    const handleSortChange = (newSortCriteria) => {
        setSortCriteria(newSortCriteria);
    };

    if (loading) {
        return <p className="text-center text-gray-500 py-10">Loading tasks...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">Error: {error}</p>;
    }

    return (
        <div className="mt-6">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">My Tasks</h3>
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <TaskFilter 
                    onFilterChange={handleFilterChange} 
                    initialFilters={filters} 
                    onClearFilters={handleClearFiltersInParent}
                />
                <TaskSort 
                    onSortChange={handleSortChange}
                    initialSortCriteria={sortCriteria}
                />
            </div>
            
            {tasks.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No tasks found for the current filters/sort.</p>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <TaskItem 
                            key={task.id} 
                            task={task} 
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

export default TaskList;

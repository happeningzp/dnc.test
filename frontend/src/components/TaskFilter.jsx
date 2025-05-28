import React, { useState, useEffect } from 'react';

const STATUS_OPTIONS = [
    { value: '', label: 'Any Status' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Done' },
];

const PRIORITY_OPTIONS = [
    { value: '', label: 'Any Priority' },
    { value: '1', label: '1 (Low)' },
    { value: '2', label: '2' },
    { value: '3', label: '3 (Medium)' },
    { value: '4', label: '4' },
    { value: '5', label: '5 (High)' },
];

const TaskFilter = ({ onFilterChange, initialFilters = {}, onClearFilters }) => {
    const [title, setTitle] = useState(initialFilters.title || '');
    const [status, setStatus] = useState(initialFilters.status || '');
    const [priorityFrom, setPriorityFrom] = useState(initialFilters.priority_from || '');
    const [priorityTo, setPriorityTo] = useState(initialFilters.priority_to || '');

    useEffect(() => {
        setTitle(initialFilters.title || '');
        setStatus(initialFilters.status || '');
        setPriorityFrom(initialFilters.priority_from || '');
        setPriorityTo(initialFilters.priority_to || '');
    }, [initialFilters]);

    const commonInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const commonLabelClasses = "block text-sm font-medium text-gray-700";
    const commonButtonClasses = "py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
    const primaryButtonClasses = "text-white bg-indigo-600 hover:bg-indigo-700";
    const secondaryButtonClasses = "text-gray-700 bg-gray-200 hover:bg-gray-300";

    const handleApplyFilters = () => {
        onFilterChange({
            title: title.trim() || null,
            status: status || null,
            priority_from: priorityFrom || null,
            priority_to: priorityTo || null,
        });
    };

    const handleClearInternal = () => {
        setTitle('');
        setStatus('');
        setPriorityFrom('');
        setPriorityTo('');
        if (onClearFilters) {
            onClearFilters();
        } else {
            onFilterChange({});
        }
    };

    return (
        <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Filter Tasks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
                <div className="lg:col-span-2">
                    <label htmlFor="filter-title" className={commonLabelClasses}>Title:</label>
                    <input
                        type="text"
                        id="filter-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Search by title..."
                        className={commonInputClasses}
                    />
                </div>
                <div>
                    <label htmlFor="filter-status" className={commonLabelClasses}>Status:</label>
                    <select id="filter-status" value={status} onChange={(e) => setStatus(e.target.value)} className={commonInputClasses}>
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-priority-from" className={commonLabelClasses}>Priority From:</label>
                    <select id="filter-priority-from" value={priorityFrom} onChange={(e) => setPriorityFrom(e.target.value)} className={commonInputClasses}>
                        {PRIORITY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="filter-priority-to" className={commonLabelClasses}>Priority To:</label>
                    <select id="filter-priority-to" value={priorityTo} onChange={(e) => setPriorityTo(e.target.value)} className={commonInputClasses}>
                        {PRIORITY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-2 items-end">
                    <button onClick={handleApplyFilters} className={`${commonButtonClasses} ${primaryButtonClasses} w-full sm:w-auto`}>Apply</button>
                    <button onClick={handleClearInternal} className={`${commonButtonClasses} ${secondaryButtonClasses} w-full sm:w-auto`}>Clear</button>
                </div>
            </div>
        </div>
    );
};

export default TaskFilter;

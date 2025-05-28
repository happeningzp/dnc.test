import React, { useState, useEffect } from 'react';

const SORT_BY_OPTIONS = [
    { value: 'created_at', label: 'Created At' },
    { value: 'title', label: 'Title' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' },
];

const ORDER_OPTIONS = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' },
];

const TaskSort = ({ onSortChange, initialSortCriteria = {} }) => {
    const [sortBy, setSortBy] = useState(initialSortCriteria.sortBy || 'created_at');
    const [order, setOrder] = useState(initialSortCriteria.order || 'desc');

    const commonInputClasses = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    const commonLabelClasses = "block text-sm font-medium text-gray-700";

    useEffect(() => {
        onSortChange({ sortBy, order });
    }, [sortBy, order, onSortChange]);

    useEffect(() => {
        setSortBy(initialSortCriteria.sortBy || 'created_at');
        setOrder(initialSortCriteria.order || 'desc');
    }, [initialSortCriteria]);

    return (
        <div className="p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50">
            <h4 className="text-md font-semibold text-gray-700 mb-3">Sort Tasks</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="sort-by" className={commonLabelClasses}>Sort By:</label>
                    <select 
                        id="sort-by" 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className={commonInputClasses}
                    >
                        {SORT_BY_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="sort-order" className={commonLabelClasses}>Order:</label>
                    <select 
                        id="sort-order" 
                        value={order} 
                        onChange={(e) => setOrder(e.target.value)}
                        className={commonInputClasses}
                    >
                        {ORDER_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TaskSort;

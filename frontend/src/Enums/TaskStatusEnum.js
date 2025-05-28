// frontend/src/Enums/TaskStatusEnum.js
export const TaskStatusEnum = Object.freeze({
    PENDING: { value: 0, label: 'Pending' },
    DONE: { value: 1, label: 'Done' },
});

// Helper to get label from value, if needed
export const getStatusLabel = (value) => {
    for (const key in TaskStatusEnum) {
        if (TaskStatusEnum[key].value === value) {
            return TaskStatusEnum[key].label;
        }
    }
    return 'Unknown';
};

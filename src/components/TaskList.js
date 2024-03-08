import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

const TaskList = ({ tasks }) => {
    return (
        <div className="task-list">
            <h2>Task List</h2>
            <ul>
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </ul>
        </div>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            title: PropTypes.string.isRequired,
            deadline: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
            expectedTime: PropTypes.string.isRequired // Add expectedTime prop
        }).isRequired
    ).isRequired
};

export default TaskList;

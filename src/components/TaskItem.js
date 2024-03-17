// TaskItem.js
import React from 'react';
import PropTypes from 'prop-types';
import '../CSS/TaskItem.css'; // Import CSS file

const TaskItem = ({ task, markTaskCompleted, deleteTask }) => {
    const { id, title, deadline, completed, expectedTime } = task;

    const handleMarkCompleted = () => {
        if (window.confirm("Are you sure you want to mark this task as complete?")) {
            markTaskCompleted(id);
        }
    }

    const handleDeleteTask = () => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            deleteTask(id);
        }
    }

    return (
        <div className={`task-item ${completed ? 'completed' : ''}`}>
            <div className="task-content">
                <h3>{title}</h3>
                <p>Deadline: {deadline}</p>
                <p>Expected Completion Time: {expectedTime} Hours</p>
            </div>
            <div className="task-buttons">
                <button className="delete-button" onClick={handleDeleteTask}>Delete Task</button>
                {!completed && <button className="complete-button" onClick={handleMarkCompleted}>Mark as Complete</button>}
            </div>
        </div>
    );
}

TaskItem.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
        expectedTime: PropTypes.string.isRequired
    }).isRequired,
    markTaskCompleted: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired
};

export default TaskItem;

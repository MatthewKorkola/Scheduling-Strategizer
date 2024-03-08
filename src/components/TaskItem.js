import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../CSS/TaskItem.css'; // Import CSS file

const TaskItem = ({ task, markTaskCompleted, deleteTask }) => {
    const { id, title, deadline, completed, expectedTime } = task;
    const [showMenu, setShowMenu] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedDeadline, setEditedDeadline] = useState(deadline);
    const [editedExpectedTime, setEditedExpectedTime] = useState(expectedTime);

    const handleDragStart = (e) => {
        e.dataTransfer.setData("text/plain", id);
    }

    const handleMouseDown = (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;

        const offsetX = e.clientX - item.getBoundingClientRect().left;
        const offsetY = e.clientY - item.getBoundingClientRect().top;

        const handleMouseMove = (e) => {
            item.style.left = e.clientX - offsetX + 'px';
            item.style.top = e.clientY - offsetY + 'px';
        }

        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    const handlePopupButtonClick = (e) => {
        setShowMenu(!showMenu);
    }

    const handleMarkCompleted = () => {
        markTaskCompleted(id);
        setShowMenu(false); // Close the popup menu after marking as completed
    }

    const handleDeleteTask = () => {
        deleteTask(id);
        setShowMenu(false); // Close the popup menu after deleting the task
    }

    const handleTitleChange = (e) => {
        setEditedTitle(e.target.value);
    }

    const handleDeadlineChange = (e) => {
        setEditedDeadline(e.target.value);
    }

    const handleExpectedTimeChange = (e) => {
        setEditedExpectedTime(e.target.value);
    }

    return (
        <div className={`task-item ${completed ? 'completed' : ''}`} draggable onDragStart={handleDragStart} onMouseDown={handleMouseDown}>
            <div className="task-content">
                <h3>{title}</h3>
                <p>Deadline: {deadline}</p>
                <p>Expected Time: {expectedTime}</p>
            </div>
            <button className="options-button" onClick={handlePopupButtonClick}>Options</button> {/* Options button */}
            {showMenu && (
                <div className="popup-menu">
                    <label htmlFor="editedTitle">Title</label>
                    <input type="text" id="editedTitle" value={editedTitle} onChange={handleTitleChange} />

                    <label htmlFor="editedDeadline">Deadline</label>
                    <input type="date" id="editedDeadline" value={editedDeadline} onChange={handleDeadlineChange} />

                    <label htmlFor="editedExpectedTime">Expected Time</label>
                    <input type="text" id="editedExpectedTime" placeholder="Enter expected time" value={editedExpectedTime} onChange={handleExpectedTimeChange} />

                    <button onClick={handleMarkCompleted}>Mark as Completed</button>
                    <button onClick={handleDeleteTask}>Delete Task</button>
                </div>
            )}
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

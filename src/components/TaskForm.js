import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TaskForm = ({ addTask }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [expectedTime, setExpectedTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !deadline.trim() || !expectedTime.trim()) return;
        addTask({ title, deadline, completed: false, expectedTime });
        setTitle('');
        setDeadline('');
        setExpectedTime('');
    }

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <input type="text" placeholder="Expected time" value={expectedTime} onChange={(e) => setExpectedTime(e.target.value)} />
            <button type="submit">Add Task</button>
        </form>
    );
}

TaskForm.propTypes = {
    addTask: PropTypes.func.isRequired
};

export default TaskForm;

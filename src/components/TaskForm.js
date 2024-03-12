import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TaskForm = ({ addTask, createProject, selectProject, deleteProject, currentProject, projectCompletionPercentage, projects }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [expectedTime, setExpectedTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !deadline.trim() || !expectedTime.trim()) return;
        if (!currentProject) {
            alert('Please select a project first.');
            return;
        }
        addTask({ title, deadline, completed: false, expectedTime });
        setTitle('');
        setDeadline('');
        setExpectedTime('');
    }

    const handleCreateProject = () => {
        const newProjectName = prompt("Enter new project name:");
        if (newProjectName !== null) {
            createProject(newProjectName);
        }
    }

    return (
        <div className="task-form">
        <div> Project and Task Manager </div>
            <div> <button onClick={handleCreateProject}>Create Project</button> </div>
            <div className="project-actions">
                <select onChange={(e) => selectProject(e.target.value)}>
                    <option>Select Project</option>
                    {projects.map(project => (
                        <option key={project.name} value={project.name} selected={currentProject && currentProject.name === project.name}>{project.name}</option>
                    ))}
                </select>
                <select onChange={(e) => deleteProject(e.target.value)}>
                    <option></option>
                    {projects.map(project => (
                        <option key={project.name} value={project.name}>{project.name}</option>
                    ))}
                </select>
            </div>
            <div> Create Task </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                <input type="text" placeholder="Expected time" value={expectedTime} onChange={(e) => setExpectedTime(e.target.value)} />
                <button type="submit">Add Task</button>
            </form>
            <div> Project Completion:  </div>
            <div className="project-completion">
                {projectCompletionPercentage()}
            </div>
        </div>
    );
}

TaskForm.propTypes = {
    addTask: PropTypes.func.isRequired,
    createProject: PropTypes.func.isRequired,
    selectProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    currentProject: PropTypes.object, // Current project object
    projectCompletionPercentage: PropTypes.string.isRequired, // Project completion percentage text
    projects: PropTypes.array.isRequired
};

export default TaskForm;

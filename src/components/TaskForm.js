import React, { useState } from 'react';
import '../CSS/TaskForm.css';
import PropTypes from 'prop-types';
import { Popup } from 'reactjs-popup';

const TaskForm = ({ addTask, createProject, selectProject, deleteProject, currentProject, projectCompletionPercentage, projects }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [expectedTime, setExpectedTime] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

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
        setIsPopupOpen(false)
    }

    const handleCreateProject = () => {
        const newProjectName = prompt("Enter new project name:");
        if (newProjectName !== null) {
            createProject(newProjectName);
        }
    }

    const handleCreateTaskClick = () => {
        setIsPopupOpen(true);
    }

    return (
        <div className="task-form">
        <div className="project-task-manager"> Project and Task Manager </div>
            <div > <button onClick={handleCreateProject}>Create Project</button> </div>
            <div className="project-actions">
                <select onChange={(e) => selectProject(e.target.value)}>
                    <option></option>
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
            <div className="create-task">
                <div className="create-task-text">
                    <button onClick={handleCreateTaskClick}>Create Task</button>
                </div>
                <Popup open={isPopupOpen} closeOnDocumentClick onClose={() => setIsPopupOpen(false)}>
                    <div className="taskform-popup-content">
                        <form onSubmit={handleSubmit} className="taskform-popup-form">
                            <div className="taskform-popup-header">Create Task</div>
                            <div>
                                <input type="text" placeholder="Task Name" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div>
                                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                            </div>
                            <div>
                                <input type="text" placeholder="Expected Completion Time" value={expectedTime} onChange={(e) => setExpectedTime(e.target.value)} />
                            </div>
                            <div className="taskform-popup-footer">
                                <button type="submit" className="taskform-popup-button">Add Task</button>
                            </div>
                        </form>
                        <button className="taskform-popup-button" onClick={() => setIsPopupOpen(false)}>Exit</button>
                    </div>
                </Popup>
            </div>
            <div className="project-completion-text"> Project Completion:  </div>
            <div className={`${projectCompletionPercentage() === '100%' ? 'gold' : 'project-completion'}`}>
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

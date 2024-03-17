import React, { useState } from 'react';
import Header from './components/Header';
import Pomodoro from './components/Pomodoro'
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([
        //{ id: 1, title: 'Task 1', deadline: '2024-03-10', completed: false, expectedTime: '2 hours' },
        //{ id: 2, title: 'Task 2', deadline: '2024-03-15', completed: false, expectedTime: '1 hour' }
    ]);

    const [projects, setProjects] = useState([]); // State for projects
    const [currentProject, setCurrentProject] = useState(null); // State for current project

    const addTask = (newTask) => {
        if (!currentProject) {
            alert('Please select a project first.');
            return;
        }
        if (tasks.length >= 30) {
          alert('You have reached the maximum limit of tasks. Please delete a task before creating a new one.')
          return;
        }

        setTasks([...tasks, { id: tasks.length + 1, ...newTask, project: currentProject.name }]);
    }

    const createProject = (newProjectName) => {
        if (!newProjectName.trim()) {
            alert('Project name must not be empty.');
            return;
        }
        if (projects.length >= 9) {
            alert('You have reached the maximum limit of projects. Please delete a project before creating a new one.');
            return;
        }
        if (projects.some(project => project.name === newProjectName)) {
            alert('Project name must be unique.');
            return;
        }
        const newProject = { name: newProjectName, tasks: [] };
        setProjects([...projects, newProject]);
        setCurrentProject(newProject); // Set the newly created project as the current project
    }

    const selectProject = (projectName) => {
        const project = projects.find(project => project.name === projectName);
        setCurrentProject(project ? project: currentProject);
    }

    const deleteProject = (projectName) => {
        if (!projectName) {
            // If the user cancels, simply return without further action
            return;
        }
        if (window.confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
            const updatedProjects = projects.filter(project => project.name !== projectName);
            setProjects(updatedProjects);

            // Remove tasks associated with the deleted project
            const updatedTasks = tasks.filter(task => task.project !== projectName);
            setTasks(updatedTasks);

            setCurrentProject(null);
        }
    }

    const markTaskCompleted = (taskId) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, completed: true } : task
        );
        setTasks(updatedTasks);
    }

    const deleteTask = (taskId) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
    }

    // Calculate project completion percentage
    const projectCompletionPercentage = () => {
      if (!currentProject) {
          return 'Select Project First';
      }

      const projectTasks = tasks.filter(task => task.project === currentProject.name);
      const totalTasks = projectTasks.length;

      if (totalTasks === 0) {
          return 'Create Task First';
      }

      const completedTasks = projectTasks.filter(task => task.completed).length;
      const percentage = Math.round((completedTasks / totalTasks) * 100);

      return `${percentage}%`;
  };

    return (
        <div className="App">
            <div className="header-section">
                <Header />
            </div>
            <div className="pomodoro-section">
                <Pomodoro />
            </div>
            <div className="task-form-section">
                <TaskForm 
                    addTask={addTask}
                    createProject={createProject}
                    selectProject={selectProject}
                    deleteProject={deleteProject}
                    currentProject={currentProject}
                    projectCompletionPercentage={projectCompletionPercentage}
                    projects={projects} // Pass projects array as a prop to TaskForm
                />
            </div>
            <div className="task-list-section">
                <TaskList 
                  tasks={tasks}
                  currentProject={currentProject}
                  markTaskCompleted={markTaskCompleted}
                  deleteTask={deleteTask}
                />
            </div>
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import Header from './components/Header';
import Pomodoro from './components/Pomodoro'
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';
import axios from 'axios';

function App() {
    const [tasks, setTasks] = useState([
        //{ id: 1, title: 'Task 1', deadline: '2024-03-10', completed: false, expectedTime: '2 hours' },
        //{ id: 2, title: 'Task 2', deadline: '2024-03-15', completed: false, expectedTime: '1 hour' }
    ]);

    const [projects, setProjects] = useState([]); // State for projects
    const [currentProject, setCurrentProject] = useState(null); // State for current project

    const addTask = async (newTask) => {
        if (!currentProject) {
            alert('Please select a project first.');
            return;
        }
        if (tasks.length >= 30) {
            alert('You have reached the maximum limit of tasks. Please delete a task before creating a new one.')
            return;
        }

        try {
            // Send a request to the server to add the task
            const response = await axios.post('http://localhost:5000/api/addTask', {
                taskDetails: { ...newTask, project: currentProject.name },
                loggedInUsername: sessionStorage.getItem('loggedInUsername')
            });

            // If the task is successfully added on the server, update the state with the new task
            // const addedTask = response.data;
            // const { taskname, deadline, completed, expectedtime } = addedTask; // Extract necessary properties
            // const formattedTask = {
            //     id: tasks.length + 1, // Generate a unique ID
            //     title: taskname,
            //     deadline: deadline,
            //     completed: completed,
            //     expectedTime: expectedtime,
            //     project: currentProject.name
            // };
            // setTasks([...tasks, addedTask]);
            const addedTask = response.data;
            const addedTaskID = addedTask.taskid;
            //alert(addedTaskID);
            //alert(JSON.stringify(addedTaskID));
            setTasks([...tasks, { id: addedTaskID, title: addedTask.taskname, ...newTask, project: currentProject.name }]);

        } catch (error) {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again later.');
        }
    }

    const createProject = async (newProjectName) => {
        if (sessionStorage.getItem("loggedIn") === null) {
            alert("Log in to create a project.")
            return;
        }
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

        try {
            // Send a request to the server to create the project
            const response = await axios.post('http://localhost:5000/api/createProject', {
                projectDetails: { name: newProjectName },
                loggedInUsername: sessionStorage.getItem('loggedInUsername')
            });

            // If the project is successfully created on the server, update the state with the new project
            const newProjectData = response.data; // Data received from the server
            const newProject = { 
                name: newProjectData.projectname, // Extract project name from server response
                tasks: [] // Assuming tasks will be managed separately
            };
            //alert(JSON.stringify(response.data));
            setProjects([...projects, newProject]);
            setCurrentProject(newProject); // Set the newly created project as the current project
        } catch (error) {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again later.');
        }
    }

    const selectProject = (projectName) => {
        const project = projects.find(project => project.name === projectName);
        setCurrentProject(project ? project: currentProject);
    }

    const deleteProject = async (projectName) => {
        if (!projectName) {
            // If the user cancels, simply return without further action
            return;
        }
        if (window.confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
            try {
                // Send a request to the server to delete the project
                await axios.post('http://localhost:5000/api/deleteProject', {
                    loggedInUsername: sessionStorage.getItem('loggedInUsername'),
                    projectName: projectName
                });

                // If the server responds successfully, update the state to reflect the deletion
                const updatedProjects = projects.filter(project => project.name !== projectName);
                setProjects(updatedProjects);

                // Remove tasks associated with the deleted project
                const updatedTasks = tasks.filter(task => task.project !== projectName);
                setTasks(updatedTasks);

                setCurrentProject(null);
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project. Please try again later.');
            }
        }
    };


    const markTaskCompleted = async (taskId) => {
        try {
            // Send a request to the server to mark the task as completed
            await axios.post('http://localhost:5000/api/markTaskCompleted', {
                loggedInUsername: sessionStorage.getItem('loggedInUsername'),
                projectName: currentProject.name,
                taskId: taskId
            });

            // If the server responds successfully, update the state to reflect the change
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, completed: true } : task
            );
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error marking task as completed:', error);
            alert('Failed to mark task as completed. Please try again later.');
        }
    };


    const deleteTask = async (taskId) => {
        try {
            // Send a request to the server to delete the task
            await axios.post('http://localhost:5000/api/deleteTask', {
                loggedInUsername: sessionStorage.getItem('loggedInUsername'),
                projectName: currentProject.name,
                taskId: taskId
            });

            // If the server responds successfully, update the state to reflect the deletion
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            setTasks(updatedTasks);
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task. Please try again later.');
        }
    };


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

    const sortTasks = (sortOption) => {
      // Filter tasks based on the current project for sorting
      const filteredTasks = currentProject
          ? tasks.filter(task => task.project === currentProject.name)
          : [...tasks]; // If no current project selected, use all tasks

      // Implement sorting logic based on the selected option
      let sortedTasks;
      if (sortOption === 'earliestDeadline') {
          sortedTasks = [...filteredTasks].sort((a, b) => {
              return new Date(a.deadline) - new Date(b.deadline);
          });
      } else if (sortOption === 'latestDeadline') {
          sortedTasks = [...filteredTasks].sort((a, b) => {
              return new Date(b.deadline) - new Date(a.deadline);
          });
      } else if (sortOption === 'shortestTime') {
          sortedTasks = [...filteredTasks].sort((a, b) => {
              return parseFloat(a.expectedTime) - parseFloat(b.expectedTime);
          });
      } else if (sortOption === 'longestTime') {
          sortedTasks = [...filteredTasks].sort((a, b) => {
              return parseFloat(b.expectedTime) - parseFloat(a.expectedTime);
          });
      } else if (sortOption === 'completeness') {
          sortedTasks = [...filteredTasks].sort((a, b) => {
              return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
          });
      }

    // Update the state with the sorted tasks
    setTasks(currentTasks => {
        // Map over the original tasks and replace only the tasks belonging to the current project with the sorted tasks
        return tasks.map(task => {
            if (currentProject && task.project === currentProject.name) {
                return sortedTasks.shift(); // Replace the task with the first task in the sorted array
            } else {
                return task; // Keep tasks from other projects unchanged
            }
        });
    });
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
                  sortTasks={sortTasks}
                />
            </div>
        </div>
    );
}

export default App;

import React, { useState } from 'react';
import Header from './components/Header';
import Pomodoro from './components/Pomodoro'
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Footer from './components/Footer';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', deadline: '2024-03-10', completed: false, expectedTime: '2 hours' },
        { id: 2, title: 'Task 2', deadline: '2024-03-15', completed: false, expectedTime: '1 hour' }
    ]);

    const addTask = (newTask) => {
        setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
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

    return (
        <div className="App">
            <div className="header-section">
                <Header />
            </div>
            <div className="pomodoro-section">
                <Pomodoro />
            </div>
            <div className="task-form-section">
                <TaskForm addTask={addTask} />
            </div>
            <div className="task-list-section">
                <TaskList tasks={tasks} markTaskCompleted={markTaskCompleted} deleteTask={deleteTask} />
            </div>
            <div className="footer-section">
                <Footer />
            </div>
        </div>
    );
}

export default App;

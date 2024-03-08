import React, { useState } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Footer from './components/Footer';
import './App.css';

function App() {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', deadline: '2024-03-10', completed: false, expectedTime: '2 hours' },
        { id: 2, title: 'Task 2', deadline: '2024-03-15', completed: true, expectedTime: '1 hour' }
    ]);

    const addTask = (newTask) => {
        setTasks([...tasks, { id: tasks.length + 1, ...newTask }]);
    }

    const saveEditedTask = (editedTask) => {
        const updatedTasks = tasks.map(task =>
            task.id === editedTask.id ? { ...task, ...editedTask } : task
        );
        setTasks(updatedTasks);
    }

    return (
        <div className="App">
            <Header />
            <TaskForm addTask={addTask} />
            <TaskList tasks={tasks} />
            <Footer />
        </div>
    );
}

export default App;

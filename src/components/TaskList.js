import React from 'react';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, currentProject, markTaskCompleted, deleteTask }) => {
    // Filter tasks based on the current project
    const filteredTasks = currentProject
        ? tasks.filter(task => task.project === currentProject.name)
        : [];

    return (
        <div className="task-list">
            {filteredTasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    markTaskCompleted={markTaskCompleted}
                    deleteTask={deleteTask}
                />
            ))}
        </div>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array.isRequired,
    currentProject: PropTypes.object,
    markTaskCompleted: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired
};

export default TaskList;

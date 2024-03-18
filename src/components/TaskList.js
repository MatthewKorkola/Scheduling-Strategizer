import React from 'react';
import '../CSS/TaskList.css';
import PropTypes from 'prop-types';
import TaskItem from './TaskItem';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const TaskList = ({ tasks, currentProject, markTaskCompleted, deleteTask, sortTasks }) => {
    // Filter tasks based on the current project
    const filteredTasks = currentProject
        ? tasks.filter(task => task.project === currentProject.name)
        : [];

    // Determine if there are fewer than 2 tasks within the current project
    const notEnoughTasks = filteredTasks.length < 2;

    return (
        <div className="task-list">
        <div className="task-text"> Tasks {currentProject ? `(Current Project: ${currentProject.name})` : '(No Project Open)'} </div>
            

        
        <div className="task-sort">
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button>
                        Sort Tasks
                    </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={-185}>
                    {notEnoughTasks ? (
                        <DropdownMenu.Item className="DropdownMenuNotItem">
                            Not enough tasks to sort
                        </DropdownMenu.Item>
                    ) : (
                        <>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => sortTasks('earliestDeadline')}>
                                Sort by Earliest Deadline
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => sortTasks('latestDeadline')}>
                                Sort by Latest Deadline
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => sortTasks('shortestTime')}>
                                Sort by Shortest Time to Complete
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => sortTasks('longestTime')}>
                                Sort by Longest Time to Complete
                            </DropdownMenu.Item>
                            <DropdownMenu.Item className="DropdownMenuItem" onSelect={() => sortTasks('completeness')}>
                                Sort by Completeness
                            </DropdownMenu.Item>
                        </>
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>



            {/* Render task items */}
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
    deleteTask: PropTypes.func.isRequired,
    sortTasks: PropTypes.func.isRequired
};

export default TaskList;

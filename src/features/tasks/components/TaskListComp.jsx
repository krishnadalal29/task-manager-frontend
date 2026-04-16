import "../styles/TaskListComp.css";
import TaskListItem from "./TaskListItemComp";
function TaskList({ tasks, startEdit, deleteTask }) {
    return (
        <section
            className="task-list-panel"
            aria-live="polite"
            aria-label="Task list panel"
        >
            <div className="task-list-panel-glow" aria-hidden="true" />

            <header className="task-list-header">
                <div>
                    <p className="task-list-eyebrow">Work Queue</p>
                    <h2 className="task-list-title">Task List</h2>
                </div>
                <span className="task-list-count">{tasks.length} items</span>
            </header>

            {tasks.length === 0 ? (
                <p className="task-list-empty">
                    No tasks yet. Add your first one from the form.
                </p>
            ) : (
                <ul className="task-list-grid">
                    {tasks.map((task) => (
                       <TaskListItem key={task._id} task={task} startEdit={startEdit} deleteTask={deleteTask} />
                    ))}
                </ul>
            )}
        </section>
    );
}

export default TaskList;

function TaskListItem({ task, startEdit, deleteTask }) {
    return (<li key={task._id} className="task-list-item">
        <div className="task-list-item-top">
            <h3 className="task-list-item-title">{task.taskName}</h3>

            <div className="task-list-actions">
                <button
                    type="button"
                    className="task-icon-btn task-icon-btn--edit"
                    onClick={() => startEdit(task)}
                    aria-label={`Edit ${task.taskName}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="task-icon-svg"
                        aria-hidden="true"
                    >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z" />
                    </svg>
                </button>

                <button
                    type="button"
                    className="task-icon-btn task-icon-btn--delete"
                    onClick={() => {
                        const shouldDelete = window.confirm(`Delete "${task.taskName}"?`);
                        if (shouldDelete) {
                            void deleteTask(task._id);
                        }
                    }}
                    aria-label={`Delete ${task.taskName}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="task-icon-svg"
                        aria-hidden="true"
                    >
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                    </svg>
                </button>
            </div>
        </div>

        {task.description ? (
            <p className="task-list-description">{task.description}</p>
        ) : (
            <p className="task-list-description-muted">No description</p>
        )}

        <div className="task-list-tags">
            {task.tags.length === 0 ? (
                <span className="task-list-no-tags">No tags</span>
            ) : (
                task.tags.map((tag) => (
                    <span className="task-list-tag" key={`${task._id}-${tag._id}`}>
                        {tag.tagName}
                    </span>
                ))
            )}
        </div>
    </li>);
}

export default TaskListItem;
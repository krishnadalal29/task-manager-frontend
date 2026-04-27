import { useEffect } from "react";
import TagsPage from "../../tags/pages/TagsPage";
import TaskList from "./TaskListComp";
import "../styles/TasksComp.css";
import TaskForm from "./TaskFormComp";

function Tasks({
    onLogout,
    taskTitle,
    setTaskTitle,
    description,
    setDescription,
    availableTags,
    selectedTagIds,
    editingTaskId,
    clearForm,
    showTagManager,
    tagsLoading,
    tagsError,
    tasks,
    startEdit,
    deleteTask,
    openTagManager,
    toggleTag,
    handleSubmit,
    closeTagManager,
    handleTagsChange,
}) {
    useEffect(() => {
        if (!showTagManager) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                void closeTagManager();
            }
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showTagManager, closeTagManager]);

    return (
        <div className="task-layout-grid">
            <section className="task-form-panel" aria-label="Task manager form">
                <div className="task-form-panel-glow" aria-hidden="true" />

                <header className="task-form-header">
                    <div>
                        <p className="task-eyebrow">Workflow</p>
                        <h1 className="task-title">Task Manager</h1>
                        <p className="task-subtitle">
                            Create focused tasks, attach tags, and keep projects easy to scan..
                        </p>
                    </div>

                    <div className="task-metrics" aria-label="Task and tag summary">
                        <p className="task-metric">
                            <span className="task-metric-count">{tasks.length}</span> Tasks
                        </p>
                        <p className="task-metric">
                            <span className="task-metric-count">{availableTags.length}</span> Tags
                        </p>
                    </div>
                </header>

                <TaskForm
                    handleSubmit={handleSubmit}
                    taskTitle={taskTitle}
                    setTaskTitle={setTaskTitle}
                    description={description}
                    setDescription={setDescription}
                    availableTags={availableTags}
                    selectedTagIds={selectedTagIds}
                    toggleTag={toggleTag}
                    openTagManager={openTagManager}
                    tagsLoading={tagsLoading}
                    tagsError={tagsError}
                    editingTaskId={editingTaskId}
                    clearForm={clearForm}
                />

            </section>

            <TaskList
                tasks={tasks}
                startEdit={startEdit}
                deleteTask={deleteTask}
            />

            {showTagManager ? (
                <div
                    className="task-tag-modal"
                    role="presentation"
                    onClick={() => {
                        void closeTagManager();
                    }}
                >
                    <aside
                        className="task-tag-modal-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Tag Studio"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="task-tag-modal-header">
                            <div>
                                <p className="task-tag-modal-eyebrow">Tag Studio</p>
                                <h2 className="task-tag-modal-title">Manage tags for tasks</h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeTagManager}
                                className="task-tag-modal-close"
                            >
                                Close
                            </button>
                        </div>

                        <TagsPage
                            initialTags={availableTags}
                            onTagsChange={handleTagsChange}
                            fullWidth
                            onUnauthorized={onLogout}
                        />
                    </aside>
                </div>
            ) : null}
        </div>
    );
}

export default Tasks;

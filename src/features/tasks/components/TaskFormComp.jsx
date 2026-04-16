function TaskForm({ handleSubmit, taskTitle, setTaskTitle, description, setDescription, availableTags, selectedTagIds, toggleTag, openTagManager, tagsLoading, tagsError, editingTaskId, clearForm }) {
    return (
        <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-field">
                <label htmlFor="taskTitle" className="task-label">Task Name</label>
                <input
                    id="taskTitle"
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="e.g. Build login page"
                    maxLength={80}
                    className="task-input"
                    required
                />
            </div>

            <div className="task-field">
                <label htmlFor="taskDescription" className="task-label">Description (Optional)</label>
                <textarea
                    id="taskDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add extra details for this task"
                    rows={3}
                    maxLength={240}
                    className="task-input task-input--textarea"
                />
            </div>

            <div className="task-tag-row">
                <p className="task-tag-row-label">Select Tags</p>
                <button
                    type="button"
                    className="task-tag-studio-btn"
                    onClick={openTagManager}
                >
                    Open Tag Studio
                </button>
            </div>

            <div className="task-tag-picker" aria-live="polite">
                {tagsLoading ? (
                    <p className="task-tag-status">Loading tags...</p>
                ) : tagsError ? (
                    <p className="task-tag-status task-tag-status--error">{tagsError}</p>
                ) : availableTags.length === 0 ? (
                    <p className="task-tag-status">No tags available. Open Tag Studio to create some.</p>
                ) : (
                    availableTags.map((tag) => {
                        const selected = selectedTagIds.includes(tag._id);
                        return (
                            <button
                                key={tag._id}
                                type="button"
                                className={`task-tag-chip${selected ? " task-tag-chip--selected" : ""}`}
                                onClick={() => toggleTag(tag._id)}
                            >
                                {tag.tagName}
                            </button>
                        );
                    })
                )}
            </div>

            <p className="task-selected-helper">
                {selectedTagIds.length} tag{selectedTagIds.length === 1 ? "" : "s"} selected
            </p>

            <div className="task-actions">
                <button type="submit" className="task-submit-btn">
                    {editingTaskId ? "Update Task" : "Add Task"}
                </button>
                {editingTaskId ? (
                    <button type="button" onClick={clearForm} className="task-cancel-btn">
                        Cancel Edit
                    </button>
                ) : null}
            </div>
        </form>
    );
}

export default TaskForm;
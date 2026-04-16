function TagsForm({ handleSubmit, draft, setDraft, handleKeyDown, placeholder }) {
    return (
        <form className="tag-editor-form" onSubmit={handleSubmit}>
            <label htmlFor="tagName" className="tag-editor-label">Add a tag</label>

            <div className="tag-editor-input-row">
                <input
                    name="tagName"
                    id="tagName"
                    type="text"
                    value={draft}
                    placeholder={placeholder}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={30}
                    className="tag-editor-input"
                />
                <button type="submit" className="tag-editor-submit">Add</button>
            </div>

            <p className="tag-editor-hint">Press Enter or comma to create quickly.</p>
        </form>
    );
}

export default TagsForm;
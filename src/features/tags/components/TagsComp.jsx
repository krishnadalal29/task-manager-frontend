import "../styles/TagsComp.css";
import TagList from "./TagListComp";
import TagsForm from "./TagsFormComp";

function Tags({
    title,
    description,
    placeholder,
    draft,
    tags,
    maxTags,
    setDraft,
    handleSubmit,
    handleKeyDown,
    removeTag,
    fullWidth = false,
}) {
    return (
        <section
            className={`tag-editor-panel${fullWidth ? " tag-editor-panel--full" : ""}`}
            aria-label="Tag component"
        >
            <header className="tag-editor-header">
                <div>
                    <h1 className="tag-editor-title">{title}</h1>
                    <p className="tag-editor-description">{description}</p>
                </div>

                <div className="tag-editor-stats" aria-label="Tag limit and usage">
                    <p className="tag-editor-stat">
                        <span className="tag-editor-stat-count">{tags.length}</span> Used
                    </p>
                    <p className="tag-editor-stat">
                        <span className="tag-editor-stat-count">{maxTags}</span> Max
                    </p>
                </div>
            </header>

            <TagsForm
                handleSubmit={handleSubmit}
                draft={draft}
                setDraft={setDraft}
                handleKeyDown={handleKeyDown}
                placeholder={placeholder}
            />

            <p className="tag-editor-meta">{tags.length} tags</p>

            <TagList tags={tags} removeTag={removeTag} />
        </section>
    );
}



export default Tags;

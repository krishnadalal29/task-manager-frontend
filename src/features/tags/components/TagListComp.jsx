import TagItem from "./TagItemComp";
function TagList({ tags, removeTag }) {
    return (
        <ul className="tag-editor-list" aria-live="polite">
            {tags.length === 0 ? (
                <li className="tag-editor-empty">No tags yet. Add one above.</li>
            ) : (
                tags.map((tag) => (
                    <TagItem key={tag._id} tag={tag} removeTag={removeTag} />
                ))
            )}
        </ul>
    );
}

export default TagList;
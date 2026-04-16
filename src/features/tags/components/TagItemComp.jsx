function TagItem({ tag, removeTag }) {
    return (
        <li className="tag-editor-item" key={tag._id}>
            <span className="tag-editor-name">#{tag.tagName}</span>
            <button
                type="button"
                className="tag-editor-remove"
                onClick={() => removeTag(tag._id)}
                aria-label={`Remove ${tag.tagName}`}
            >
                X
            </button>
        </li>
    );
}
export default TagItem;
import Tags from "../components/TagsComp";
import useTags from "../hooks/useTags";

function TagsPage({
    initialTags = [],
    onTagsChange,
    fullWidth = false,
    onUnauthorized,
}) {
    const tagProps = useTags({
        title: "Tags",
        description: "Add short labels to keep your work organized.",
        placeholder: "Type a tag and press Enter",
        maxTags: 10,
        initialTags,
        onChange: onTagsChange,
        onUnauthorized,
    });

    return <Tags {...tagProps} fullWidth={fullWidth} />;
}

export default TagsPage;

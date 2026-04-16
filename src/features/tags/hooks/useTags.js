import { useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import useFetchTags from "../../../hooks/useFetchTags";
function sanitizeTag(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function useTags({
    title,
    description,
    placeholder,
    maxTags,
    initialTags = [],
    onChange,
    onUnauthorized,
}) {
    const [draft, setDraft] = useState("");
    const isParentManaged = typeof onChange === "function";
    const {
        tags,
        setTags,
    } = useFetchTags({
        autoFetch: !isParentManaged,
        initialTags,
        onUnauthorized,
    });

    useEffect(() => {
        if (!isParentManaged) return;
        setTags(Array.isArray(initialTags) ? initialTags : []);
    }, [isParentManaged, initialTags, setTags]);

    useEffect(() => {
        if (!isParentManaged) return;
        onChange(tags);
    }, [isParentManaged, onChange, tags]);

    const pushTag = async (rawTag) => {
        const cleanTag = sanitizeTag(rawTag);
        if (!cleanTag) return;
        if (tags.length >= maxTags) return;

        const alreadyAdded = tags.some(
            (tag) => tag.tagName.toLowerCase() === cleanTag.toLowerCase()
        );

        if (alreadyAdded) return;

        try {
            let newTag = await apiClient.post("/tags/createTag", {
                tagName: cleanTag,
            });
            if (newTag.status === 201) {
                const createdTag = Array.isArray(newTag.data) ? newTag.data[0] : newTag.data;
                if (!createdTag) return;

                setTags((currentTags) => {
                    return [...currentTags, createdTag];
                });
                setDraft("");
            } else {
                console.log("Something went wrong");
            }
        } catch (err) {
            if (err?.response?.status === 401 && typeof onUnauthorized === "function") {
                onUnauthorized();
                return;
            }
            console.error("Error creating tag:", err);
        }
    };

    const removeTag = async (tagToRemove) => {
        try {
            let deletedTag = await apiClient.delete(`/tags/deleteTag/${tagToRemove}`);
            if (deletedTag.status === 200 || deletedTag.status === 201 || deletedTag.status === 204) {
                setTags((currentTags) => {
                    return currentTags.filter(
                        (tag) => tag._id !== tagToRemove
                    );
                });
            } else {
                console.log("Something went wrong");
            }
        } catch (err) {
            if (err?.response?.status === 401 && typeof onUnauthorized === "function") {
                onUnauthorized();
                return;
            }
            console.error("Error deleting tag:", err);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        pushTag(draft);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            pushTag(draft);
            return;
        }

        if (event.key === "Backspace" && !draft && tags.length) {
            removeTag(tags[tags.length - 1]._id);
        }
    };

    return {
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
    };
}

export default useTags;

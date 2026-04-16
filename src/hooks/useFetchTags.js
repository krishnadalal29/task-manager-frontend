import { useCallback, useEffect, useState } from "react";
import apiClient from "../api/apiClient";

function useFetchTags({ autoFetch = true, initialTags = [], onUnauthorized } = {}) {
    const [tags, setTags] = useState(() => (
        Array.isArray(initialTags) ? initialTags : []
    ));
    const [tagsLoading, setTagsLoading] = useState(Boolean(autoFetch));
    const [tagsError, setTagsError] = useState("");

    const fetchTags = useCallback(async () => {
        setTagsLoading(true);
        setTagsError("");

        try {
            const res = await apiClient.get("/tags/getAllTags");
            const nextTags = Array.isArray(res.data) ? res.data : [];
            setTags(nextTags);
        } catch (error) {
            if (error?.response?.status === 401 && typeof onUnauthorized === "function") {
                onUnauthorized();
            }
            setTagsError("Unable to load tags right now.");
        } finally {
            setTagsLoading(false);
        }
    }, [onUnauthorized]);

    useEffect(() => {
        if (!autoFetch) {
            setTagsLoading(false);
            return;
        }

        fetchTags();
    }, [autoFetch, fetchTags]);

    return {
        tags,
        setTags,
        tagsLoading,
        tagsError,
        fetchTags,
    };
}

export default useFetchTags;

import { useCallback, useEffect, useState } from "react";
import apiClient from "../../../api/apiClient";
import useFetchTags from "../../../hooks/useFetchTags";

function normalizeInput(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
}

function isUnauthorizedError(error) {
    return error?.response?.status === 401;
}

function extractTaskOwnerId(task) {
    if (!task || typeof task !== "object") return "";

    const directOwnerId = task.userId || task.ownerId || task.createdById;
    if (typeof directOwnerId === "string") return directOwnerId;

    const ownerEntity = task.user || task.owner || task.createdBy;
    if (!ownerEntity || typeof ownerEntity !== "object") return "";

    return ownerEntity._id || ownerEntity.id || "";
}

function filterTasksByUser(tasks, currentUser) {
    if (!Array.isArray(tasks)) return [];

    const userId = currentUser?._id || currentUser?.id || "";
    if (!userId) return tasks;

    const hasOwnerMetadata = tasks.some((task) => Boolean(extractTaskOwnerId(task)));
    if (!hasOwnerMetadata) return tasks;

    return tasks.filter((task) => extractTaskOwnerId(task) === userId);
}

function normalizeTaskTag(tag) {
    if (tag && typeof tag === "object") {
        return {
            _id: tag._id || tag.id || tag.tagName || "",
            tagName: tag.tagName || tag.name || String(tag._id || tag.id || "Tag"),
        };
    }

    if (typeof tag === "string") {
        return { _id: tag, tagName: tag };
    }

    return null;
}

function normalizeTask(task) {
    const safeTask = task && typeof task === "object" ? task : {};
    const tags = Array.isArray(safeTask.tags)
        ? safeTask.tags.map(normalizeTaskTag).filter(Boolean)
        : [];

    return {
        ...safeTask,
        tags,
    };
}

function useTasks({ isAuthenticated = true, currentUser = null, onUnauthorized } = {}) {
    const [taskTitle, setTaskTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [showTagManager, setShowTagManager] = useState(false);
    const {
        tags: availableTags,
        setTags: setAvailableTags,
        tagsLoading,
        tagsError,
        fetchTags,
    } = useFetchTags({ autoFetch: false, onUnauthorized });

    const clearForm = useCallback(() => {
        setTaskTitle("");
        setDescription("");
        setSelectedTagIds([]);
        setEditingTaskId(null);
    }, []);

    const fetchTasks = useCallback(async () => {
        if (!isAuthenticated) {
            setTasks([]);
            return;
        }

        try {
            const res = await apiClient.get("/tasks/getAllTasks");
            const fetchedTasks = Array.isArray(res.data) ? res.data : [];
            setTasks(filterTasksByUser(fetchedTasks, currentUser).map(normalizeTask));
        } catch (error) {
            if (isUnauthorizedError(error) && typeof onUnauthorized === "function") {
                onUnauthorized();
                return;
            }
            console.log("Unable to load tasks right now.");
        }
    }, [isAuthenticated, currentUser, onUnauthorized]);

    useEffect(() => {
        if (!isAuthenticated) {
            setAvailableTags([]);
            setTasks([]);
            setShowTagManager(false);
            clearForm();
            return;
        }

        fetchTags();
        fetchTasks();
    }, [isAuthenticated, fetchTags, fetchTasks, setAvailableTags, clearForm]);

    const toggleTag = useCallback((tagId) => {
        setSelectedTagIds((currentIds) =>
            currentIds.includes(tagId)
                ? currentIds.filter((_id) => _id !== tagId)
                : [...currentIds, tagId]
        );
    }, []);

    const handleSubmit = useCallback(async (event) => {
        try {
            event.preventDefault();
            if (!isAuthenticated) return;

            const cleanTitle = normalizeInput(taskTitle);
            if (!cleanTitle) return;

            const cleanDescription = normalizeInput(description);
            const selectedTags = availableTags
                .filter((tag) => selectedTagIds.includes(tag._id))
                .map((tag) => ({
                    _id: tag._id,
                    tagName: tag.tagName,
                }));

            if (editingTaskId) {
                const updateTask = {
                    taskName: cleanTitle,
                    description: cleanDescription,
                    tags: selectedTags.map((tag) => tag._id),
                };
                const updatedTask = await apiClient.put(`/tasks/updateTask/${editingTaskId}`, updateTask);
                if (updatedTask.status === 200) {
                    setTasks((currentTasks) =>
                        currentTasks.map((task) =>
                            task._id === editingTaskId
                                ? {
                                    ...task,
                                    taskName: cleanTitle,
                                    description: cleanDescription,
                                    tags: selectedTags,
                                }
                                : task
                        )
                    );
                    clearForm();
                    return;
                }

                alert("Something went wrong");
                return;
            } else {
                const newTask = {
                    taskName: cleanTitle,
                    description: cleanDescription,
                    tags: selectedTags.map((tag) => tag._id),
                };
                const createdTaskResponse = await apiClient.post("/tasks/createTask", newTask);
                if (createdTaskResponse.status === 201) {
                    const createdTask = createdTaskResponse.data || {};
                    const createdTaskTags = Array.isArray(createdTask.tags) && createdTask.tags.length > 0
                        ? createdTask.tags
                        : selectedTags;

                    setTasks((currentTasks) => [
                        normalizeTask({
                            ...createdTask,
                            taskName: createdTask.taskName || cleanTitle,
                            description: createdTask.description ?? cleanDescription,
                            tags: createdTaskTags,
                        }),
                        ...currentTasks,
                    ]);
                    clearForm();
                } else {
                    alert("Something went wrong");
                }
            }
        } catch (err) {
            if (isUnauthorizedError(err) && typeof onUnauthorized === "function") {
                onUnauthorized();
                return;
            }
            console.error(err);
        }
    }, [
        isAuthenticated,
        taskTitle,
        description,
        availableTags,
        selectedTagIds,
        editingTaskId,
        clearForm,
        onUnauthorized,
    ]);

    const startEdit = useCallback((task) => {
        setEditingTaskId(task._id);
        setTaskTitle(task.taskName);
        setDescription(task.description || "");
        setSelectedTagIds(task.tags?.map((tag) => tag._id || tag.id || tag) || []);
    }, []);

    const deleteTask = useCallback(async (taskId) => {
        if (!taskId) return;

        const previousTasks = tasks;
        setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));

        if (editingTaskId === taskId) {
            clearForm();
        }

        try {
            const response = await apiClient.delete(`/tasks/deleteTask/${taskId}`);

            const successCodes = [200, 201, 204];
            if (!successCodes.includes(response.status)) {
                setTasks(previousTasks);
            }
        } catch (error) {
            if (isUnauthorizedError(error) && typeof onUnauthorized === "function") {
                onUnauthorized();
                return;
            }
            console.error("Unable to delete task:", error);
            setTasks(previousTasks);
        }
    }, [tasks, editingTaskId, clearForm, onUnauthorized]);

    const openTagManager = useCallback(() => {
        if (!isAuthenticated) return;
        setShowTagManager(true);
    }, [isAuthenticated]);

    const closeTagManager = useCallback(() => {
        setShowTagManager(false);
    }, []);

    const handleTagsChange = useCallback((updatedTags) => {
        const safeTags = Array.isArray(updatedTags) ? updatedTags : [];
        setAvailableTags(safeTags);
        setSelectedTagIds((currentIds) =>
            currentIds.filter((_id) => safeTags.some((tag) => tag._id === _id))
        );
    }, [setAvailableTags]);

    return {
        taskTitle,
        setTaskTitle,
        description,
        setDescription,
        availableTags,
        selectedTagIds,
        editingTaskId,
        clearForm,
        // existing ones
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
    };
}

export default useTasks;

import Tasks from "../components/TasksComp";
import useTasks from "../hooks/useTasks";

function TasksPage({ currentUser, onLogout }) {
    const taskProps = useTasks({
        isAuthenticated: Boolean(currentUser),
        currentUser,
        onUnauthorized: onLogout,
    });

    return <Tasks {...taskProps} onLogout={onLogout} />;
}

export default TasksPage;

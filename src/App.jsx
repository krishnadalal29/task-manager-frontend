import "./styles/css/App.css";
import { AuthPage, useAuth } from "./features/auth";
import { TasksPage } from "./features/tasks";
import { AppFooter, AppHeader } from "./components/layout";

function App() {
  const auth = useAuth();

  return (
    <main className="app-shell">
      <AppHeader
        isAuthenticated={auth.isAuthenticated}
        currentUser={auth.currentUser}
        onLogout={auth.logout}
      />

      <section className="app-content">
        {auth.isAuthenticated ? (
          <TasksPage currentUser={auth.currentUser} onLogout={auth.logout} />
        ) : (
          <AuthPage {...auth} />
        )}
      </section>

      <AppFooter />
    </main>
  );
}

export default App;

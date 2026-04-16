import "../styles/AuthPage.css";

function AuthPage({
  authMode,
  name,
  email,
  password,
  authError,
  isSubmitting,
  setName,
  setEmail,
  setPassword,
  switchMode,
  handleAuthSubmit,
}) {
  const isSignupMode = authMode === "signup";
  const appName = "Task Manager";

  return (
    <section className="auth-panel" aria-label="Authentication panel">
      <div className="auth-glow" aria-hidden="true" />
      <p className="auth-app-name">{appName}</p>

      <header className="auth-header">
        <p className="auth-eyebrow">Account Access</p>
        <h1 className="auth-title">
          {isSignupMode ? "Create your account" : "Welcome back"}
        </h1>
        <p className="auth-subtitle">
          {isSignupMode
            ? "Sign up to keep your tasks organized by user."
            : "Login to continue managing your tasks."}
        </p>
      </header>

      <div className="auth-mode-switch" role="tablist" aria-label="Login or signup">
        <button
          type="button"
          role="tab"
          aria-selected={authMode === "login"}
          className={`auth-mode-btn${authMode === "login" ? " auth-mode-btn--active" : ""}`}
          onClick={() => switchMode("login")}
        >
          Login
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={authMode === "signup"}
          className={`auth-mode-btn${authMode === "signup" ? " auth-mode-btn--active" : ""}`}
          onClick={() => switchMode("signup")}
        >
          Sign Up
        </button>
      </div>

      <form className="auth-form" onSubmit={handleAuthSubmit}>
        {isSignupMode ? (
          <label className="auth-field" htmlFor="authName">
            <span className="auth-label">Name</span>
            <input
              id="authName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="auth-input"
              placeholder="Enter your name"
              autoComplete="name"
              required
            />
          </label>
        ) : null}

        <label className="auth-field" htmlFor="authEmail">
          <span className="auth-label">Email</span>
          <input
            id="authEmail"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="auth-input"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label className="auth-field" htmlFor="authPassword">
          <span className="auth-label">Password</span>
          <input
            id="authPassword"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input"
            placeholder="Minimum 6 characters"
            autoComplete={isSignupMode ? "new-password" : "current-password"}
            minLength={6}
            required
          />
        </label>

        {authError ? (
          <p className="auth-error" role="alert">
            {authError}
          </p>
        ) : null}

        <button
          type="submit"
          className="auth-submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Please wait..."
            : isSignupMode
              ? "Create Account"
              : "Login"}
        </button>
      </form>
    </section>
  );
}

export default AuthPage;

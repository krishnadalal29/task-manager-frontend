function AppHeader({ isAuthenticated, currentUser, onLogout }) {
  const displayName =
    currentUser?.name || currentUser?.fullName || currentUser?.email || "User";
  const displayEmail = currentUser?.email || "";
  const avatarInitial = displayName.charAt(0).toUpperCase() || "U";

  return (
    <header className="app-header" aria-label="Application header">
      <div className="app-header-inner">
        <div className="app-brand">
          <p className="app-brand-eyebrow">Productivity</p>
          <h1 className="app-brand-title">Task Manager</h1>
        </div>

        {isAuthenticated ? (
          <div className="app-profile" aria-label="Profile details">
            <span className="app-profile-avatar" aria-hidden="true">
              {avatarInitial}
            </span>
            <div>
              <p className="app-profile-name">{displayName}</p>
              {displayEmail ? (
                <p className="app-profile-email">{displayEmail}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="app-profile-logout-btn"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <p className="app-header-guest">Please login or sign up</p>
        )}
      </div>
    </header>
  );
}

export default AppHeader;

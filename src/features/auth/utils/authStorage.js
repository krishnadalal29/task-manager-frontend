const AUTH_TOKEN_STORAGE_KEY = "task-manager-auth-token";
const AUTH_USER_STORAGE_KEY = "task-manager-auth-user";
const AUTH_EXPIRES_AT_STORAGE_KEY = "task-manager-auth-expires-at";

function readAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || "";
}

function readAuthUser() {
  const rawValue = localStorage.getItem(AUTH_USER_STORAGE_KEY);

  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    localStorage.removeItem(AUTH_USER_STORAGE_KEY);
    return null;
  }
}

function readAuthExpiresAt() {
  return localStorage.getItem(AUTH_EXPIRES_AT_STORAGE_KEY) || "";
}

function persistAuthSession({ token, user, expiresAt }) {
  if (!token) return;

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user || {}));
  if (expiresAt) {
    localStorage.setItem(AUTH_EXPIRES_AT_STORAGE_KEY, expiresAt);
  } else {
    localStorage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);
  }
}

function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  localStorage.removeItem(AUTH_EXPIRES_AT_STORAGE_KEY);
}

export {
  readAuthToken,
  readAuthUser,
  readAuthExpiresAt,
  persistAuthSession,
  clearAuthSession,
};

import { useCallback, useEffect, useMemo, useState } from "react";
import apiClient, { setApiClientAuthToken } from "../../../api/apiClient";
import {
  clearAuthSession,
  persistAuthSession,
  readAuthExpiresAt,
  readAuthToken,
  readAuthUser,
} from "../utils/authStorage";

const SIGNUP_ENDPOINT = "/auth/signup";
const LOGIN_ENDPOINT = "/auth/login";
const LOGOUT_ENDPOINT = "/auth/logout";

function sanitizeInput(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function normalizeEmail(value) {
  return sanitizeInput(value).toLowerCase();
}

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(value);
}

function parseResponsePayload(data) {
  if (data && typeof data === "object" && data.data && typeof data.data === "object") {
    return data.data;
  }

  return data;
}

function extractToken(payload) {
  if (!payload || typeof payload !== "object") return "";

  return (
    payload.token ||
    payload.accessToken ||
    payload.authToken ||
    payload.jwt ||
    ""
  );
}

function extractUser(payload) {
  if (!payload || typeof payload !== "object") return null;

  const candidate =
    payload.user ||
    payload.profile ||
    payload.account ||
    payload.currentUser ||
    null;

  if (candidate && typeof candidate === "object") return candidate;

  const name = payload.name || payload.fullName || "";
  const email = payload.email || "";

  if (!name && !email) return null;

  return { name, email };
}

function parseExpiresAt(payload) {
  if (!payload || typeof payload !== "object") return "";

  const rawExpiresAt =
    payload.expiresAt ||
    payload.expiration ||
    payload.expires ||
    payload.expiry ||
    "";

  if (!rawExpiresAt) return "";

  const timestamp = new Date(rawExpiresAt).getTime();
  if (Number.isNaN(timestamp)) return "";

  return new Date(timestamp).toISOString();
}

function isSessionExpired(expiresAt) {
  if (!expiresAt) return false;
  const timestamp = new Date(expiresAt).getTime();
  if (Number.isNaN(timestamp)) return false;

  return timestamp <= Date.now();
}

function getFriendlyAuthError(error, mode) {
  const status = error?.response?.status;
  const apiMessage =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.msg;

  if (apiMessage) return apiMessage;

  if (mode === "signup" && status === 409) {
    return "An account already exists with this email.";
  }

  if (mode === "login" && (status === 400 || status === 401)) {
    return "Invalid email or password.";
  }

  if (status === 404) {
    return "Auth endpoint not found. Please verify your backend auth routes.";
  }

  return "Unable to continue right now. Please try again.";
}

function useAuth() {
  const [authMode, setAuthMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(() => {
    const token = readAuthToken();
    if (!token) return null;

    const expiresAt = readAuthExpiresAt();
    if (isSessionExpired(expiresAt)) {
      clearAuthSession();
      return null;
    }

    setApiClientAuthToken(token);

    return {
      token,
      user: readAuthUser(),
      expiresAt,
    };
  });

  useEffect(() => {
    setApiClientAuthToken(session?.token || "");
  }, [session]);

  const applySession = useCallback((payload, fallbackEmail) => {
    const token = extractToken(payload);
    if (!token) return false;

    const expiresAt = parseExpiresAt(payload);
    const user = extractUser(payload) || {
      name: "",
      email: fallbackEmail,
    };

    setApiClientAuthToken(token);
    persistAuthSession({ token, user, expiresAt });
    setSession({ token, user, expiresAt });
    return true;
  }, []);

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
  }, []);

  const switchMode = useCallback((nextMode) => {
    setAuthMode(nextMode);
    setAuthError("");
    setPassword("");
    if (nextMode === "login") {
      setName("");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(LOGOUT_ENDPOINT);
    } catch (error) {
      // Logout should always clear local session even if the API request fails.
    } finally {
      clearAuthSession();
      setApiClientAuthToken("");
      setSession(null);
      setAuthError("");
      setPassword("");
    }
  }, []);

  useEffect(() => {
    if (!session?.expiresAt) return undefined;

    const remainingMs = new Date(session.expiresAt).getTime() - Date.now();
    if (remainingMs <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      logout();
    }, remainingMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [session?.expiresAt, logout]);

  const handleAuthSubmit = useCallback(async (event) => {
    event.preventDefault();

    const cleanName = sanitizeInput(name);
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = String(password || "").trim();

    if (authMode === "signup" && !cleanName) {
      setAuthError("Name is required.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setAuthError("Enter a valid email address.");
      return;
    }

    if (cleanPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthError("");
    setIsSubmitting(true);

    try {
      if (authMode === "signup") {
        const signupResponse = await apiClient.post(SIGNUP_ENDPOINT, {
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
        });

        const signupPayload = parseResponsePayload(signupResponse?.data);
        const signupCreatedSession = applySession(signupPayload, cleanEmail);

        if (!signupCreatedSession) {
          const loginResponse = await apiClient.post(LOGIN_ENDPOINT, {
            email: cleanEmail,
            password: cleanPassword,
          });
          const loginPayload = parseResponsePayload(loginResponse?.data);
          const loginCreatedSession = applySession(loginPayload, cleanEmail);

          if (!loginCreatedSession) {
            throw new Error("No auth token returned after signup/login.");
          }
        }
      } else {
        const loginResponse = await apiClient.post(LOGIN_ENDPOINT, {
          email: cleanEmail,
          password: cleanPassword,
        });
        const loginPayload = parseResponsePayload(loginResponse?.data);
        const loginCreatedSession = applySession(loginPayload, cleanEmail);

        if (!loginCreatedSession) {
          throw new Error("Login response did not include an auth token.");
        }
      }

      resetForm();
    } catch (error) {
      setAuthError(getFriendlyAuthError(error, authMode));
    } finally {
      setIsSubmitting(false);
    }
  }, [name, email, password, authMode, applySession, resetForm]);

  const authState = useMemo(() => ({
    authMode,
    name,
    email,
    password,
    authError,
    isSubmitting,
    isAuthenticated: Boolean(session?.token) && !isSessionExpired(session?.expiresAt),
    currentUser: session?.user || null,
    setName,
    setEmail,
    setPassword,
    switchMode,
    handleAuthSubmit,
    logout,
  }), [
    authMode,
    name,
    email,
    password,
    authError,
    isSubmitting,
    session,
    switchMode,
    handleAuthSubmit,
    logout,
  ]);

  return authState;
}

export default useAuth;

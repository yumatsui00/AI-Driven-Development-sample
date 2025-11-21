import type { Session } from "@/types/auth";

const SESSION_KEY = "session";

/**
 * Read session from localStorage. Returns null on missing/invalid.
 */
export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Session;
    if (parsed && parsed.login === true && typeof parsed.email === "string" && typeof parsed.userId === "string") {
      return parsed;
    }
  } catch (e) {
    return null;
  }
  return null;
}

/**
 * Persist session to localStorage.
 */
export function setSession(session: Session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear session in localStorage.
 */
export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

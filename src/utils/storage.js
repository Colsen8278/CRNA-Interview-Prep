// Persistent storage helpers using localStorage
const PREFIX = "crna-prep-";

export function loadState(key, defaultValue) {
  try {
    const saved = localStorage.getItem(PREFIX + key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function removeState(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // fail silently
  }
}

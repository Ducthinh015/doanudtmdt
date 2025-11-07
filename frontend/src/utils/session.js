// Simple session id stored in localStorage
export function getSessionId() {
  let sid = localStorage.getItem("sessionId");
  if (!sid) {
    sid = cryptoRandomUUID();
    localStorage.setItem("sessionId", sid);
  }
  return sid;
}

function cryptoRandomUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  // fallback UUID v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

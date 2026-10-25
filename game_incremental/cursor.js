import cursors from "./json/cursor.json" with { type: "json" };

export function setCursor(cursorName) {
  document.body.style.cursor = cursors[cursorName];
}
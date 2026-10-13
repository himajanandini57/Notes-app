const STORAGE_KEY = "notes-app-data";
const THEME_KEY = "notes-app-theme";

const form = document.getElementById("note-form");
const titleInput = document.getElementById("note-title");
const bodyInput = document.getElementById("note-body");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const formTitle = document.getElementById("form-title");
const searchInput = document.getElementById("search");
const notesEl = document.getElementById("notes");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const exportBtn = document.getElementById("export-btn");
const themeToggle = document.getElementById("theme-toggle");

let notes = loadNotes();
let editingId = null;

function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function formatDate(ts) {
  return new Date(ts).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function render() {
  const query = searchInput.value.trim().toLowerCase();

  const visible = notes
    .filter(n => n.title.toLowerCase().includes(query) || n.body.toLowerCase().includes(query))
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);

  notesEl.innerHTML = "";

  visible.forEach(note => {
    const card = document.createElement("article");
    card.className = "note" + (note.pinned ? " pinned" : "");

    const h3 = document.createElement("h3");
    h3.textContent = (note.pinned ? "📌 " : "") + note.title;

    const p = document.createElement("p");
    p.textContent = note.body;

    const time = document.createElement("time");
    time.textContent = (note.updatedAt !== note.createdAt ? "Edited " : "Created ") + formatDate(note.updatedAt);

    const actions = document.createElement("div");
    actions.className = "note-actions";
    actions.append(
      makeButton(note.pinned ? "Unpin" : "Pin", "secondary", () => togglePin(note.id)),
      makeButton("Edit", "secondary", () => startEdit(note.id)),
      makeButton("Delete", "delete", () => deleteNote(note.id))
    );

    card.append(h3, p, time, actions);
    notesEl.appendChild(card);
  });

  emptyEl.classList.toggle("hidden", visible.length > 0);
  countEl.textContent = `${notes.length} note${notes.length === 1 ? "" : "s"} total`;
}

function makeButton(label, className, handler) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = label;
  btn.className = className;
  btn.addEventListener("click", handler);
  return btn;
}

function addOrUpdateNote(e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  if (!title || !body) return;

  if (editingId) {
    const note = notes.find(n => n.id === editingId);
    note.title = title;
    note.body = body;
    note.updatedAt = Date.now();
  } else {
    const now = Date.now();
    notes.push({ id: String(now), title, body, pinned: false, createdAt: now, updatedAt: now });
  }

  saveNotes();
  resetForm();
  render();
}

function startEdit(id) {
  const note = notes.find(n => n.id === id);
  editingId = id;
  titleInput.value = note.title;
  bodyInput.value = note.body;
  formTitle.textContent = "Edit note";
  saveBtn.textContent = "Save changes";
  cancelBtn.classList.remove("hidden");
  titleInput.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  editingId = null;
  form.reset();
  formTitle.textContent = "New note";
  saveBtn.textContent = "Add note";
  cancelBtn.classList.add("hidden");
}

function deleteNote(id) {
  if (!confirm("Delete this note?")) return;
  notes = notes.filter(n => n.id !== id);
  if (editingId === id) resetForm();
  saveNotes();
  render();
}

function togglePin(id) {
  const note = notes.find(n => n.id === id);
  note.pinned = !note.pinned;
  saveNotes();
  render();
}

function exportNotes() {
  if (notes.length === 0) return alert("No notes to export yet.");
  const text = notes
    .map(n => `${n.title}\n${formatDate(n.createdAt)}\n\n${n.body}\n`)
    .join("\n------------------------------\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "my-notes.txt";
  link.click();
  URL.revokeObjectURL(link.href);
}

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
}

form.addEventListener("submit", addOrUpdateNote);
cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", render);
exportBtn.addEventListener("click", exportNotes);
themeToggle.addEventListener("click", () => applyTheme(!document.body.classList.contains("dark")));

applyTheme(localStorage.getItem(THEME_KEY) === "dark");
render();

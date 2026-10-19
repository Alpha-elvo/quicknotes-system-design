const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.querySelector("#load-btn");
const statusMessage = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");

// Reusable HTTP helper: reject unsuccessful responses and return JSON.
async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return { data: null, status: response.status };
  }

  const data = await response.json();
  return { data, status: response.status };
}

function showStatus(message, type = "") {
  statusMessage.textContent = message;
  statusMessage.className = type;
}

function renderEmptyState() {
  const item = document.createElement("li");
  item.className = "empty-state";
  item.textContent = "No notes found. Load notes or create one.";
  notesList.replaceChildren(item);
}

function renderNote(note) {
  const item = document.createElement("li");
  item.className = "note";

  const title = document.createElement("h3");
  title.textContent = note.title || "Untitled note";

  const body = document.createElement("p");
  body.textContent = note.body || "No body provided.";

  item.append(title, body);
  return item;
}

async function loadNotes() {
  loadButton.disabled = true;
  showStatus("Loading notes...", "loading");

  try {
    const { data: notes } = await request(`${API_URL}?_limit=10`);
    notesList.replaceChildren();

    if (notes.length === 0) {
      renderEmptyState();
      showStatus("No notes were returned by the server.", "success");
      return;
    }

    const fragment = document.createDocumentFragment();

    for (const note of notes) {
      fragment.append(renderNote(note));
    }

    notesList.append(fragment);
    showStatus(`Loaded ${notes.length} notes from the server.`, "success");
  } catch (error) {
    showStatus(
      "Sorry, we couldn't load your notes. Check your connection and try again.",
      "error"
    );
    console.error("Load notes failed:", error);
  } finally {
    loadButton.disabled = false;
  }
}

loadButton.addEventListener("click", loadNotes);

// POST will be implemented in the next task.
noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showStatus("Note creation will be added in the next step.", "loading");
});

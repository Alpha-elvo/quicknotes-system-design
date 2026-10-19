const API_URL = "https://jsonplaceholder.typicode.com/posts";

const loadButton = document.querySelector("#load-btn");
const statusMessage = document.querySelector("#status");
const notesList = document.querySelector("#notes-list");
const noteForm = document.querySelector("#note-form");
const titleInput = document.querySelector("#title-input");
const bodyInput = document.querySelector("#body-input");
const submitButton = document.querySelector("#submit-btn");

async function request(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return { data: null, status: response.status };
  }

  return {
    data: await response.json(),
    status: response.status
  };
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

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.textContent = "Delete";
  deleteButton.className = "delete-btn";
  deleteButton.addEventListener("click", () => deleteNote(note.id, item, deleteButton));

  item.append(title, body, deleteButton);
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
    showStatus("Could not load notes. Check your connection.", "error");
    console.error("Load notes failed:", error);
  } finally {
    loadButton.disabled = false;
  }
}

async function createNote(event) {
  event.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title) {
    showStatus("Please enter a title.", "error");
    titleInput.focus();
    return;
  }

  if (title.length > 100) {
    showStatus("The title must be 100 characters or fewer.", "error");
    return;
  }

  submitButton.disabled = true;
  showStatus("Creating note...", "loading");

  try {
    const { data: note } = await request(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId: 1
      })
    });

    notesList.querySelector(".empty-state")?.remove();
    notesList.prepend(renderNote(note));
    noteForm.reset();

    showStatus("Note created successfully!", "success");
  } catch (error) {
    showStatus("Could not create note. Please try again.", "error");
    console.error("Create note failed:", error);
  } finally {
    submitButton.disabled = false;
  }
async function deleteNote(noteId, noteElement, deleteButton) {
  deleteButton.disabled = true;
  showStatus("Deleting note...", "loading");

  try {
    await request(`${API_URL}/${noteId}`, {
      method: "DELETE"
    });

    noteElement.remove();
    showStatus("Note deleted successfully.", "success");

    if (notesList.children.length === 0) {
      renderEmptyState();
    }
  } catch (error) {
    showStatus("Could not delete note. Please try again.", "error");
    console.error("Delete note failed:", error);
    deleteButton.disabled = false;
  }
}
}

loadButton.addEventListener("click", loadNotes);
noteForm.addEventListener("submit", createNote);

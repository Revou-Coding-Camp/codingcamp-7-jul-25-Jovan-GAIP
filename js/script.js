const form = document.getElementById("todoForm");
const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const todoList = document.getElementById("todoList");
const filterDate = document.getElementById("filterDate");
const filterName = document.getElementById("filterName");
const clearFilter = document.getElementById("clearFilter");

let tasks = [];
let editingIndex = null; // indikator apakah sedang mengedit

function renderTasks() {
  todoList.innerHTML = "";

  const filterDateValue = filterDate.value;
  const filterNameValue = filterName.value.toLowerCase();

  const filteredTasks = tasks
    .filter(task => {
      const matchDate = !filterDateValue || task.date === filterDateValue;
      const matchName = !filterNameValue || task.text.toLowerCase().includes(filterNameValue);
      return matchDate && matchName;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // urut dari terbaru ke terlama

  if (filteredTasks.length === 0) {
    todoList.innerHTML = "<li>Tidak ada tugas ditemukan</li>";
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <span>${task.text}</span>
        <small>${task.date}</small>
      </div>
      <div class="actions">
        <button class="edit-btn" onclick="editTask(${index})">Edit</button>
        <button class="delete-btn" onclick="deleteTask(${index})">Hapus</button>
      </div>
    `;
    todoList.appendChild(li);
  });
}

function deleteTask(index) {
  if (confirm("Yakin ingin menghapus tugas ini?")) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

function editTask(index) {
  const task = tasks[index];
  taskInput.value = task.text;
  dateInput.value = task.date;
  editingIndex = index;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = dateInput.value;

  if (!text || !date) return;

  if (editingIndex !== null) {
    // sedang edit
    tasks[editingIndex] = { text, date };
    editingIndex = null;
  } else {
    // tambah baru
    tasks.push({ text, date });
  }

  taskInput.value = "";
  dateInput.value = "";
  renderTasks();
});

filterDate.addEventListener("input", renderTasks);
filterName.addEventListener("input", renderTasks);

clearFilter.addEventListener("click", () => {
  filterDate.value = "";
  filterName.value = "";
  renderTasks();
});

// Initial render
renderTasks();

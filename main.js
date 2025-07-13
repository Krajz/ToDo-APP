const button = document.getElementById("confirm");
const inputValue = document.getElementById("taskInput");
const taskContainer = document.querySelector(".todo-container");

let tasks = [];

// Save tasks to localStorage
function saveTasksToLocalStorage() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

// Load tasks from localStorage and handle data migration
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("todoTasks");
    if (storedTasks) {
        // Migrate old string-based tasks to object format with text and completed properties
        tasks = JSON.parse(storedTasks).map(task => {
            if (typeof task === 'string') {
                return { text: task, completed: false };
            }
            return { text: task.text, completed: task.completed || false };
        });
        renderTasks();
    }
}

// Add event listeners for adding tasks
button.addEventListener("click", () => {
    addTask();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && document.activeElement === inputValue) {
        addTask();
    }
});

// Add a new task to the tasks array
function addTask() {
    const taskText = inputValue.value.trim();
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        inputValue.value = "";
        renderTasks();
        saveTasksToLocalStorage();
    }
}

// Render tasks to the DOM, display empty message if no tasks
function renderTasks() {
    taskContainer.innerHTML = "";
    if (tasks.length === 0) {
        // Display message when no tasks exist
        const emptyMessage = document.createElement("div");
        emptyMessage.classList.add("empty-message");
        emptyMessage.textContent = "Your ToDo is empty";
        taskContainer.appendChild(emptyMessage);
    } else {
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement("div");
            taskDiv.classList.add("task");
            taskDiv.dataset.index = index;

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.classList.add("task-checkbox");
            checkbox.checked = task.completed;
            checkbox.onclick = () => toggleTaskCompletion(index);

            const taskSpan = document.createElement("span");
            taskSpan.classList.add("task-item");
            taskSpan.textContent = task.text;
            if (task.completed) {
                taskSpan.classList.add("completed");
            }

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edit-task");
            editButton.dataset.index = index;
            editButton.onclick = () => editTask(index);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-button");
            deleteButton.dataset.index = index;
            deleteButton.onclick = () => deleteTask(index);

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(taskSpan);
            taskDiv.appendChild(editButton);
            taskDiv.appendChild(deleteButton);
            taskContainer.appendChild(taskDiv);
        });
    }
}

// Toggle task completion status
function toggleTaskCompletion(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    saveTasksToLocalStorage();
}

// Delete a task from the tasks array
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    saveTasksToLocalStorage();
}

// Edit a task by replacing it with an input field
function editTask(index) {
    const taskElement = taskContainer.children[index];
    const originalTaskText = tasks[index].text;

    taskElement.innerHTML = `
        <input type="text" value="${originalTaskText}" class="edit-input" id="editInput_${index}">
        <button class="save-task-button" onclick='saveTask(${index})'>Save</button>
    `;

    const editInput = document.getElementById(`editInput_${index}`);
    editInput.focus();

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveTask(index);
        }
    });
}

// Save edited task text
function saveTask(index) {
    const editInput = document.getElementById(`editInput_${index}`);
    if (editInput && editInput.value.trim()) {
        tasks[index].text = editInput.value.trim();
        renderTasks();
        saveTasksToLocalStorage();
    } else if (editInput && !editInput.value.trim()) {
        alert("Task cannot be empty!");
        renderTasks();
    }
}

// Initialize app by loading tasks on DOM load
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);
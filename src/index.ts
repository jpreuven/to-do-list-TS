import { v4 as uuidV4 } from "uuid";

//TS Types
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

//Global Variables
const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");
const addButton = document.querySelector<HTMLButtonElement>("#add-button");

/////////////////////////////////////////////////

//Event Listeners
// Creating new tasks
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input?.value == "" || input?.value == null) {
    let emptyForm = setInterval(() => {
      flashForm();
    }, 75);
    setTimeout(() => {
      clearInterval(emptyForm);
      form?.classList.remove("title-form-empty");
    }, 300);

    return;
  }

  function flashForm() {
    form?.classList.contains("title-form-empty")
      ? form?.classList.remove("title-form-empty")
      : form?.classList.add("title-form-empty");
  }

  const newTask: Task = {
    id: "f" + uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  addTask(newTask);
  addListItem(newTask);
  input.value = "";
});

input?.addEventListener("focus", () => {
  form?.classList.add("title-form-focused");
});

input?.addEventListener("blur", () => {
  form?.classList.remove("title-form-focused");
});

addButton?.addEventListener("mouseover", () => {
  addButton?.classList.add("add-button-hover");
});
addButton?.addEventListener("mouseout", () => {
  addButton?.classList.remove("add-button-hover");
});

addButton?.addEventListener("mousedown", () => {
  addButton?.classList.add("add-button-click");
});

addButton?.addEventListener("mouseup", () => {
  addButton?.classList.remove("add-button-click");
});

//Functions
// Add new item to list
function addListItem(task: Task) {
  const item = document.createElement("li");
  const label = document.createElement("label");
  const span = document.createElement("span");
  const startTime = document.createElement("span");
  const endTime = document.createElement("span");

  const checkbox = document.createElement("input");
  const deleteButton = document.createElement("button");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    strikethrough(task);
    completedStrikeThrough(task);
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

  deleteButton.textContent = " 🗑";
  deleteButton.setAttribute("class", "delete-button");
  deleteButton.addEventListener("click", () => {
    deleteListItem(task, item);
  });
  label.setAttribute("id", task.id);

  label.appendChild(checkbox);
  label.appendChild(startTime);
  label.appendChild(endTime);
  label.appendChild(span);
  label.appendChild(deleteButton);

  span.textContent = task.title;
  startTime.textContent = "10:45am";
  endTime.textContent = "5:45am";

  startTime.style.padding = "0 20px 0 10px";
  endTime.style.padding = "0 20px 0 10px";
  checkbox.style.marginRight = "20px";
  span.style.padding = "0 20px 0 10px";

  span.setAttribute("id", "span-" + task.id);
  span.setAttribute("class", "task-span");

  item.appendChild(label);
  list?.appendChild(item);
}

//Delete task from list
function deleteListItem(task: Task, item: HTMLLIElement) {
  return fetch(`http://localhost:3000/tasks/${task.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then(() => {
      item.remove();
    });
}

//Creating strikethrough style
function completedStrikeThrough(task: Task) {
  if (task.completed) {
    const taskElement = document.querySelector<HTMLLabelElement>(
      `#span-${task.id}`
    );
    taskElement?.classList.add("strikethrough");
  } else {
    const taskElement = document.querySelector<HTMLLabelElement>(
      `#span-${task.id}`
    );
    taskElement?.classList.remove("strikethrough");
  }
}

// Adding task to JSON
function addTask(task: Task) {
  fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }).then((r) => r.json());
}

// Persisting Strikethrough in JSON
function strikethrough(task: Task) {
  fetch(`http://localhost:3000/tasks/${task.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed: task.completed }),
  }).then((r) => r.json());
}

// Fetching Tasks
function getTasks() {
  return fetch("http://localhost:3000/tasks").then((response) =>
    response.json()
  );
}

// Init
getTasks().then((r) => {
  r.forEach(function (task: Task) {
    addListItem(task);
    completedStrikeThrough(task);
  });
});

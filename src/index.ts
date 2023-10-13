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
  // creating new elements
  const item = document.createElement("li");
  const label = document.createElement("label");
  const span = document.createElement("span");
  // const startTime = document.createElement("span");
  // const endTime = document.createElement("span");
  const startTime = document.createElement("select");
  const endTime = document.createElement("select");

  const checkbox = document.createElement("input");
  const deleteButton = document.createElement("button");

  // Event listeners
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    strikethrough(task);
    completedStrikeThrough(task);
  });

  deleteButton.addEventListener("click", () => {
    deleteListItem(task, item);
  });

  label.addEventListener("input", (event) => {
    if (
      event.target === startTime ||
      event.target === endTime ||
      event.target === span
    ) {
      editItems(task, event.target as HTMLElement);
    }
  });

  // setting text content
  deleteButton.textContent = " 🗑";
  span.textContent = task.title;
  // startTime.textContent = "10:45am";
  // endTime.textContent = "5:45am";
  for (let i = 1; i <= 12; i++) {
    let minutes = 0;
    while (minutes < 60) {
      const startOptions = document.createElement("option");
      const endOptions = document.createElement("option");
      startOptions.textContent = minutes === 0 ? `${i}:00` : i + ":" + minutes;
      endOptions.textContent = minutes === 0 ? `${i}:00` : i + ":" + minutes;
      startTime.append(startOptions);
      endTime.append(endOptions);
      minutes += 15;
    }
  }

  checkbox.checked = task.completed;

  // applying styling
  startTime.style.padding = "0 20px 0 10px";
  startTime.style.alignSelf = "flex-start";
  // startTime.style.height = "3dvh";
  startTime.style.fontSize = "60%";
  startTime.style.border = "none";
  startTime.style.appearance = "none";
  // test
  // startTime.style.flexGrow = "0.1";
  // endTime.style.flexGrow = "0.1";

  // startTime.style.zIndex = "-1";
  endTime.style.padding = "0 20px 0 10px";
  endTime.style.alignSelf = "flex-start";
  // endTime.style.height = "3dvh";
  endTime.style.fontSize = "60%";
  endTime.style.border = "none";
  endTime.style.appearance = "none";
  // endTime.style.zIndex = "-1";

  checkbox.style.marginRight = "20px";
  span.style.padding = "0 20px 0 10px";
  startTime.style.outline = "none";
  endTime.style.outline = "none";
  span.style.outline = "none";

  //setting all attributes
  checkbox.type = "checkbox";
  deleteButton.setAttribute("class", "delete-button");
  label.setAttribute("id", task.id);
  label.setAttribute("for", "");
  startTime.setAttribute("id", "start-time-" + task.id);
  startTime.setAttribute("contenteditable", "true");
  endTime.setAttribute("id", "end-time-" + task.id);
  endTime.setAttribute("contenteditable", "true");
  span.setAttribute("id", "span-" + task.id);
  span.setAttribute("class", "task-span");
  span.setAttribute("contenteditable", "true");
  item.setAttribute("class", "task-list-item");

  // appending all elements
  label.appendChild(checkbox);
  label.appendChild(startTime);
  label.appendChild(endTime);
  label.appendChild(span);
  label.appendChild(deleteButton);
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
    const taskElement = document.querySelector<HTMLSpanElement>(
      `#span-${task.id}`
    );
    const startTimeElement = document.querySelector<HTMLSpanElement>(
      `#start-time-${task.id}`
    );
    const endTimeElement = document.querySelector<HTMLSpanElement>(
      `#end-time-${task.id}`
    );
    taskElement?.setAttribute("contenteditable", "false");
    startTimeElement?.setAttribute("disabled", "true");
    endTimeElement?.setAttribute("disabled", "true");

    taskElement?.classList.add("strikethrough");
  } else {
    const taskElement = document.querySelector<HTMLSpanElement>(
      `#span-${task.id}`
    );
    const startTimeElement = document.querySelector<HTMLSpanElement>(
      `#start-time-${task.id}`
    );
    const endTimeElement = document.querySelector<HTMLSpanElement>(
      `#end-time-${task.id}`
    );

    taskElement?.setAttribute("contenteditable", "true");
    startTimeElement?.removeAttribute("disabled");
    endTimeElement?.removeAttribute("disabled");

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

// Editing items
function editItems(task: Task, htmlElement: HTMLElement) {
  // console.log(task);
  // console.log(htmlElement);
  if (htmlElement.id.startsWith("end-time")) {
    console.log(htmlElement);
  }

  // fetch(`http://localhost:3000/tasks/${task.id}`, {
  //   method: "PATCH",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify()})
}

// Init
getTasks().then((r) => {
  r.forEach(function (task: Task) {
    addListItem(task);
    completedStrikeThrough(task);
  });
});

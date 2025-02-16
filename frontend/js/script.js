const tbody = document.querySelector("tbody");
const addForm = document.querySelector(".add-form");
const inputTask = document.querySelector(".input-task");

const fetchTasks = async () => {
  const res = await fetch("http://localhost:3333/tasks");
  const tasks = await res.json();
  return tasks;
};

const addTask = async (event) => {
  event.preventDefault();

  const task = { title: inputTask.value };

  await fetch("http://localhost:3333/tasks", {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  loadTasks();
  inputTask.value = "";
};

const deleteTask = async (id) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: "delete",
  });

  loadTasks();
};

const uptadeTask = async ({ id, title, status }) => {
  await fetch(`http://localhost:3333/tasks/${id}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, status }),
  });

  loadTasks();
};

const formatDate = (dateUTC) => {
  const options = { dateStyle: "long", timeStyle: "short" };
  const date = new Date(dateUTC).toLocaleString("pt-br", options);
  return date;
};

const createElement = (tag, innerText = "", innerHTML = "") => {
  const element = document.createElement(tag);
  element.innerText = innerText;

  if (innerText) {
    element.innerText = innerText;
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
};

const creatSelect = (value) => {
  const options = `
    <option value="pendente">Pendente</option>
    <option value="em-andamento">Em andamento</option>
    <option value="concluída">Concluída</option>
    `;

  const select = createElement("select", "", options);

  select.value = value;

  return select;
};

const createRow = (task) => {
  const { id, title, create_at, status } = task;

  const tr = createElement("tr");
  const tdTitle = createElement("td", title);
  const tdCreateAt = createElement("td", formatDate(create_at));
  const tdStatus = createElement("td");
  const tdActions = createElement("td");

  const select = creatSelect(status);

  select.addEventListener("change", ({ target }) =>
    uptadeTask({ ...task, status: target.value })
  );

  const editButton = createElement(
    "button",
    "",
    '<span class="material-symbols-outlined">edit</span>'
  );
  const deleteButton = createElement(
    "button",
    "",
    '<span class="material-symbols-outlined">delete</span>'
  );

  const editForm = createElement("form");
  const editInput = createElement("input");

  editInput.value = title;
  editForm.appendChild(editInput);

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();

    uptadeTask({ id, title: editInput.value, status });
  });

  editButton.addEventListener("click", () => {
    tdTitle.innerText = "";
    tdTitle.appendChild(editForm);
  });

  editButton.classList.add("btn-action");
  deleteButton.classList.add("btn-action");

  deleteButton.addEventListener("click", () => deleteTask(id));

  tdStatus.appendChild(select);

  tdActions.appendChild(editButton);
  tdActions.appendChild(deleteButton);

  tr.appendChild(tdTitle);
  tr.appendChild(tdCreateAt);
  tr.appendChild(tdStatus);
  tr.appendChild(tdActions);

  return tr;
};

const loadTasks = async () => {
  const tasks = await fetchTasks();

  tbody.innerHTML = "";

  tasks.forEach((task) => {
    const tr = createRow(task);
    tbody.appendChild(tr);
  });
};

addForm.addEventListener("submit", addTask);

loadTasks();

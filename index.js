const taskContainer = document.querySelector(".task__container");
const taskModal = document.querySelector(".task-modal-body");
let globalTaskData = [];

const generateHTML = (taskData) => {
  return `<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
                <div class="card">
                    <div class="card-header gap-2 d-flex justify-content-end">
                        <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this, arguments)">
                            <i class="fal fa-pencil" name=${taskData.id}></i>
                        </button>
                        <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">
                            <i class="fal fa-trash-alt" name=${taskData.id}></i>
                        </button>
                    </div>
                    <div class="card-body">
                        <img src=${taskData.image}
                             alt="image" class="card-img">
                        <h5 class="card-title mt-4">${taskData.title}</h5>
                        <p class="card-text">${taskData.description}
                        </p>
                        <span class="badge bg-primary">${taskData.type}</span>
                    </div>
                    <div class="card-footer">
                        <button type="button" class="btn btn-outline-primary" name=${taskData.id} data-bs-toggle ="modal" data-bs-target="#showTask" onclick="openTask.apply(this , arguments)">Open Task</button>
                    </div>
                </div>
            </div>`;
};

const generateModalHTML = (taskData) => {
  const date = new Date(parseInt(`${taskData.id}`));
  return `<div id=${taskData.id}>
  <img src=${taskData.image} alt="Task Image" class="card-img mb-3" />
  <strong class="text-sm text-muted ">Created on ${date.toDateString()}</strong>
  <h2 class="card-title mt-3">${taskData.title}</h2>
  <p class="leadgit ">${taskData.description}</p>
  </div>`;
};

const saveToLocalStorage = () => {
  localStorage.setItem("taskyCA", JSON.stringify({ card: globalTaskData }));
};

const insertToDOM = (content) => {
  taskContainer.insertAdjacentHTML("beforeend", content);
};

const addNewCard = () => {
  // get task data
  const taskData = {
    id: `${Date.now()}`,
    title: document.getElementById("taskTitle").value,
    image: document.getElementById("imageURL").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  globalTaskData.push(taskData);

  saveToLocalStorage();

  const newCard = generateHTML(taskData);

  insertToDOM(newCard);
  //clear the form
  document.getElementById("taskTitle").value = "";
  document.getElementById("imageURL").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("taskDescription").value = "";

  return;
};

const loadExistingCards = () => {
  // check local storage
  const getData = localStorage.getItem("taskyCA");

  // Parse JSON data if exist
  if (!getData) return;

  const taskCards = JSON.parse(getData);

  globalTaskData = taskCards.card;

  globalTaskData.map((taskData) => {
    const newCard = generateHTML(taskData);
    insertToDOM(newCard);
  });

  return;
};

const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  const removeTaskData = globalTaskData.filter((task) => task.id !== targetID);
  globalTaskData = removeTaskData;

  saveToLocalStorage();

  //access DOM to remove card
  if (elementType === "BUTTON") {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode
    );
  } else {
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode.parentNode
    );
  }
};

const editCard = (event) => {
  const elementType = event.target.tagName;

  let taskTitle;
  let taskType;
  let taskDescription;
  let parentElement;
  let submitButton;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  taskTitle = parentElement.childNodes[3].childNodes[3];
  taskDescription = parentElement.childNodes[3].childNodes[5];
  taskType = parentElement.childNodes[3].childNodes[7];
  submitButton = parentElement.childNodes[5].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");
  const elementType = event.target.tagName;

  let parentElement;

  if (elementType === "BUTTON") {
    parentElement = event.target.parentNode.parentNode;
  } else {
    parentElement = event.target.parentNode.parentNode.parentNode;
  }

  const taskTitle = parentElement.childNodes[3].childNodes[3];
  const taskDescription = parentElement.childNodes[3].childNodes[5];
  const taskType = parentElement.childNodes[3].childNodes[7];
  const submitButton = parentElement.childNodes[5].childNodes[1];

  const updatedData = {
    title: taskTitle.innerHTML,
    type: taskType.innerHTML,
    description: taskDescription.innerHTML,
  };

  const updateGlobalTasks = globalTaskData.map((task) => {
    if (task.id === targetID) {
      return { ...task, ...updatedData };
    }
    return task;
  });

  globalTaskData = updateGlobalTasks;

  saveToLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.innerHTML = "Open Task";
};

const openTask = function (e) {
  const searchId = e.target.getAttribute("name");
  console.log(searchId);

  const getTask = globalTaskData.filter(function (taskData) {
    return taskData.id === searchId;
  });
  // console.log(getTask);
  taskModal.innerHTML = generateModalHTML(getTask[0]);
};

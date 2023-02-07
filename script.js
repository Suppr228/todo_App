(() => {
  const TASKSONPAGE = 5;
  const tasksList = document.getElementById("todo-list");
  const button = document.getElementById("add-btn");
  const taskInput = document.getElementById("task-input");
  const deleteCompleted = document.getElementById("btn-del-completed");
  const checkAll = document.getElementById("btn-check-all");
  const allBtn = document.getElementById("all");
  const progressBtn = document.getElementById("progress");
  const completedBtn = document.getElementById("completed");
  const buttonsPagination = document.querySelector(".number-page");
  const buttonsGroup = document.querySelector(".nav-bar");
  const { _ } = window;

  let tasks = [];
  let filterType = "all";
  let currentPage = 1;

  const pageBack = () => {
    const arrNew = changeType();
    const lastPage = Math.ceil(arrNew.length / TASKSONPAGE);
    currentPage = currentPage > lastPage ? lastPage : currentPage;
  };

  const changeType = () => {
    switch (filterType) {
      case "progress": {
        const progressArr = tasks.filter((item) => !item.isComplete);
        return progressArr;
      }
      case "completed": {
        const completedArr = tasks.filter((item) => item.isComplete);
        return completedArr;
      }
      default:
        return tasks;
    }
  };

  const countTypes = () => {
    const allCount = tasks.length;
    allBtn.textContent = `All Tasks ${allCount}`;
    const completedArr = tasks.filter((item) => !item.isComplete);
    const progressCount = completedArr.length;
    progressBtn.textContent = `In progress ${progressCount}`;
    const completedCount = allCount - progressCount;
    completedBtn.textContent = `Completed ${completedCount}`;
    if (allCount !== completedCount) {
      checkAll.checked = false;
    } else if (completedCount === 0) {
      checkAll.checked = false;
    } else if (allCount === completedCount) {
      checkAll.checked = true;
    }
  };

  const showButtons = () => {
    let htmlList = "";
    const kolPages = Math.ceil(changeType().length / TASKSONPAGE);
    for (let i = 1; i <= kolPages; i += 1) {
      htmlList += `<button class=${
        i === Number(currentPage) ? "active-number-page-btn" : "number-page-btn"
      } id="btn-num-list">${i}</button>`;
    }
    buttonsPagination.innerHTML = htmlList;
  };

  const changeMass = () => {
    const start = TASKSONPAGE * currentPage - TASKSONPAGE;
    const end = start + TASKSONPAGE;
    const filterTasks = changeType();
    const paginationMass = filterTasks.slice(start, end);
    return paginationMass;
  };

  const validation = (textInput) => {
    const validatedInput = textInput.replace(/\s +/gi, " ").trim();
    return validatedInput;
  };

  const taskClear = (textInput) => {
    let checkedInput = true;
    if (textInput === "") {
      checkedInput = false;
    }
    return checkedInput;
  };

  const tasksRender = () => {
    const paginatedTasks = changeMass();
    showButtons();
    let htmlList = "";
    paginatedTasks.forEach((item) => {
      htmlList += `<li id="${item.id}">
  <input type="checkbox" ${item.isComplete ? "checked" : ""}>
  <span class="todo-task-title">${item.text}</span>
  <input class="rename-task" hidden>
  <button class="todo-task-del" id="btn-del">X</button>
  </li> `;
    });
    tasksList.innerHTML = htmlList;
    countTypes();
  };

  const changePage = (event) => {
    currentPage = event.target.textContent;
    tasksRender();
  };

  const pageNext = () => {
    const arrNew = changeType();
    const lastPage = Math.ceil(arrNew.length / TASKSONPAGE);
    currentPage = currentPage > lastPage ? currentPage : lastPage;
  };

  const addTask = () => {
    const newElValidated = validation(taskInput.value);
    const checkedClearInput = taskClear(newElValidated);
    const userText = newElValidated;
    const task = {
      id: Date.now(),
      text: _.escape(userText),
      isComplete: false,
    };
    if (checkedClearInput) {
      tasks.push(task);
      pageNext();
      tasksRender();
    }
    taskInput.value = "";
  };

  const pressEnter = (event) => {
    if (event.keyCode === 13) {
      addTask();
    }
  };

  const onCheck = (id, status) => {
    tasks.forEach((item) => {
      if (item.id === Number(id)) {
        item.isComplete = status;
      }
      tasksRender();
    });
  };

  const deleteCompletedElements = () => {
    tasks = tasks.filter((item) => !item.isComplete);
    pageBack();
    tasksRender();
  };

  const checkButtonBar = (event) => {
    if (event.target.type === "submit") {
      filterType = event.target.id;
      tasksRender();
      podsvetkaBtn(event);
    }
  };

  const podsvetkaBtn = (event) => {
    if (event.target.className === ".button") {
    }
    filterType = event.target.id;
    for (let i = 0; i < event.target.parentNode.children.length; i += 1) {
      event.target.parentNode.children[i].classList.add("nav-bar-btn");
      event.target.parentNode.children[i].classList.remove(
        "special-nav-bar-btn"
      );
    }
    event.target.classList.remove("nav-bar-btn");
    event.target.classList.add("special-nav-bar-btn");
    tasksRender();
  };

  const saveEnterTask = (event) => {
    if (event.keyCode === 13) {
      const newInput = event.target.parentNode.children[2];
      const { id } = event.target.parentNode;
      tasks.forEach((item) => {
        if (item.id === Number(id)) {
          item.text = validation(newInput.value);
        }
      });
      tasksRender();
    }
    if (event.keyCode === 27) {
      tasksRender();
    }
  };

  const saveTaskBlur = (event) => {
    //
    const newInput = event.target.parentNode.children[2];
    const { id } = event.target.parentNode;
    if (event.sourceCapabilities) {
      tasks.forEach((item) => {
        if (item.id === Number(id)) {
          item.text = validation(newInput.value);
        }
      });
      tasksRender();
    }
  };

  const deleteTask = (id) => {
    tasks = tasks.filter((item) => item.id !== Number(id));
    pageBack();
    tasksRender();
  };

  const editTask = (event) => {
    if (event.target.type === "checkbox") {
      onCheck(event.target.parentNode.id, event.target.checked);
    }
    if (event.target.className === "todo-task-del") {
      deleteTask(event.target.parentNode.id);
    }
    if (event.target.className === "todo-task-title" && event.detail === 2) {
      const todoText = event.target.parentNode.children[1];
      const newInput = event.target.parentNode.children[2];
      newInput.hidden = false;
      todoText.hidden = true;
      newInput.value = todoText.textContent;
    }
  };

  const checkAllElements = (status) => {
    tasks.forEach((item) => {
      item.isComplete = checkAll.checked;
    });
    tasksRender();
  };

  button.addEventListener("click", addTask);
  taskInput.addEventListener("keydown", pressEnter);
  tasksList.addEventListener("keydown", saveEnterTask);
  buttonsPagination.addEventListener("click", showButtons);
  buttonsPagination.addEventListener("click", changePage);
  buttonsGroup.addEventListener("click", checkButtonBar);
  tasksList.addEventListener("blur", saveTaskBlur, true);
  tasksList.addEventListener("click", editTask);
  checkAll.addEventListener("change", checkAllElements);
  deleteCompleted.addEventListener("click", deleteCompletedElements);
})();

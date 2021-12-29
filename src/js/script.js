"use strict";

const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");

todoButton.addEventListener("click", createTodo);
todoList.addEventListener("click", actionTodo);

getLocalTodos();
checkLengthTodoList();

function checkLengthTodoList() {
    if (todoList.childNodes.length === 0) {
        todoList.innerHTML = `<p class="empty">Todo List is empty</p>`;
    } else {
        if (todoList.querySelector(".empty"))
            todoList.querySelector(".empty").remove();
    }
}

function getLocalTodos() {
    let todos = JSON.parse(localStorage.getItem("todos"));

    if (todos) {
        todos.forEach(todoObj => {
            const todo = document.createElement("div");
            const classes = ["todo"];

            todoObj.completed ? classes.push("completed") : "";
            todo.classList.add(...classes);
            todo.setAttribute("data-id", todoObj.id);

            todo.innerHTML = `
            <input type="checkbox" ${
                todoObj.completed ? "checked" : ""
            } class="todo-checkbox" id="todo" name="todo" value="todo">
            <li class="todo-item">
            ${todoObj.text}
            </li>
            <button class="trash-btn">
                <i class="fas fa-times"></i>
            </button>
            `;

            todoList.append(todo);
        });
    }
}

function saveLocalTodo(text, id) {
    let todos = JSON.parse(localStorage.getItem("todos"));
    todos = todos === null ? [] : todos;

    localStorage.setItem(
        "todos",
        JSON.stringify([
            ...todos,
            { id: id.toString(), text, completed: false },
        ])
    );
}

function removeLocalTodo(id) {
    let todos = JSON.parse(localStorage.getItem("todos"));

    if (todos) {
        todos = todos.filter(t => t.id.toString() !== id.toString());
        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function changeLocalTodo(id, completed) {
    let todos = JSON.parse(localStorage.getItem("todos"));

    if (todos) {
        const idx = todos.findIndex(t => t.id.toString() === id.toString());

        let todo = todos[idx];
        todo.completed = completed;

        todos[idx] = todo;

        localStorage.setItem("todos", JSON.stringify(todos));
    }
}

function createTodo(e) {
    e.preventDefault();

    if (todoInput.value === "") {
        return;
    }

    const id = Date.now();

    const todo = document.createElement("div");
    todo.classList.add("todo");
    todo.setAttribute("data-id", id);

    todo.innerHTML = `
    <input type="checkbox" class="todo-checkbox" id="todo" name="todo" value="todo">
    <li class="todo-item">
       ${todoInput.value}
    </li>
    <button class="trash-btn">
        <i class="fas fa-times"></i>
    </button>
    `;
    todoList.append(todo);
    saveLocalTodo(todoInput.value, id);
    checkLengthTodoList();

    todoInput.value = "";
}

function actionTodo(e) {
    const item = e.target;

    if (item.classList.contains("trash-btn")) {
        const todo = item.parentElement;
        todo.classList.add("fall");
        const timeout = window.setTimeout(() => {
            todo.remove();

            removeLocalTodo(todo.dataset.id);
            checkLengthTodoList();

            window.clearTimeout(timeout);
        }, 400);
    }

    if (item.classList.contains("todo-checkbox")) {
        const todo = item.parentElement;
        if (item.checked) {
            todo.classList.add("completed");

            changeLocalTodo(todo.dataset.id, true);
        } else {
            todo.classList.remove("completed");

            changeLocalTodo(todo.dataset.id, false);
        }
    }
}

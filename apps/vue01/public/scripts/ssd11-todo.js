"use strict";

const arrTodo = [];

function addTodo() {
  const elTodo = document.querySelector(".js-todoText");
  const elDueDate = document.querySelector(".js-due-date");

  const name = elTodo.value;
  const dueDate = elDueDate.value;

  if (name && dueDate) {
    arrTodo.push({ name, dueDate });
    elTodo.value = "";
    elDueDate.value = "";
    renderTodo(); // 添加后立即渲染
  }
}

function deleteTodo(index) {
  // 1. 从数组中删除指定索引的条目
  arrTodo.splice(index, 1);
  // 2. 重新渲染列表
  renderTodo();
}

function textKeyup(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}

function renderTodo() {
  let strP1 = "";

  arrTodo.forEach((item, index) => {
    // strP1 += `<p>${item.name} - ${item.dueDate} <button onclick="deleteTodo(${index})">删除</button></p>`;
    strP1 += `<div>${item.name}</div>
      <div>${item.dueDate}</div>
      <button onclick="deleteTodo(${index})">删除</button>`;
  });

  document.querySelector(".js-paragraph1").innerHTML = strP1;
}

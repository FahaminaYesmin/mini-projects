// script.js

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList');
  const addBtn = document.querySelector('.input-container button');

  // Load saved tasks (if any)
  const saved = JSON.parse(localStorage.getItem('tasks') || '[]');
  saved.forEach(task => renderTask(task.text, task.completed));

  // Add task when button clicked or Enter pressed
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') addTask();
  });

  // Event delegation for complete / remove buttons
  taskList.addEventListener('click', (e) => {
    const btn = e.target;
    const li = btn.closest('li');
    if (!li) return;

    if (btn.classList.contains('complete-btn')) {
      li.querySelector('span').classList.toggle('completed');
      saveTasks();
    }

    if (btn.classList.contains('remove-btn')) {
      li.remove();
      saveTasks();
    }
  });

  // ------ Functions ------

  function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
      alert('Please enter a task');
      return;
    }
    renderTask(text, false);
    taskInput.value = '';
    saveTasks();
    taskInput.focus();
  }

  // Create and append an li using a small HTML template
  function renderTask(text, completed = false) {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="complete-btn" title="Toggle complete">✔</button>
      <span class="${completed ? 'completed' : ''}">${escapeHtml(text)}</span>
      <button class="remove-btn">Remove</button>
    `;
    taskList.appendChild(li);
  }

  // Save current tasks to localStorage
  function saveTasks() {
    const items = [...taskList.querySelectorAll('li')].map(li => {
      return {
        text: li.querySelector('span').textContent,
        completed: li.querySelector('span').classList.contains('completed')
      };
    });
    localStorage.setItem('tasks', JSON.stringify(items));
  }

  // small helper to avoid HTML injection if someone pastes HTML
  function escapeHtml(str) {
    return str.replaceAll('&', '&amp;')
              .replaceAll('<', '&lt;')
              .replaceAll('>', '&gt;')
              .replaceAll('"', '&quot;')
              .replaceAll("'", '&#39;');
  }
});

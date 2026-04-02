import { DataService } from '../../core/dataService.js';

export class TasksModule {
    constructor(container) {
        this.container = container;
        this.dataService = new DataService();
        this.tasks = [];
    }

    async render(container) {
        this.container = container;
        this.loadTasks();
        this.renderUI();
        this.attachEvents();
    }

    loadTasks() {
        this.tasks = this.dataService.getTasks();
    }

    renderUI() {
        const pendingTasks = this.tasks.filter(t => !t.completed);
        const completedTasks = this.tasks.filter(t => t.completed);
        
        this.container.innerHTML = `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: var(--font-size-2xl); font-weight: 600;">📋 Мои задачи</h2>
                    <button class="btn btn-primary" id="addTaskBtn">+ Добавить задачу</button>
                </div>
                
                <div style="margin-bottom: 32px;">
                    <h3 style="font-size: var(--font-size-lg); margin-bottom: 16px; color: var(--color-text);">
                        ⏳ Активные задачи (${pendingTasks.length})
                    </h3>
                    <div id="pendingTasksList" style="display: flex; flex-direction: column; gap: 12px;">
                        ${pendingTasks.map(task => this.renderTaskCard(task)).join('')}
                    </div>
                </div>
                
                ${completedTasks.length > 0 ? `
                <div>
                    <h3 style="font-size: var(--font-size-lg); margin-bottom: 16px; color: var(--color-text-light);">
                        ✓ Выполненные (${completedTasks.length})
                    </h3>
                    <div id="completedTasksList" style="display: flex; flex-direction: column; gap: 12px;">
                        ${completedTasks.map(task => this.renderTaskCard(task, true)).join('')}
                    </div>
                </div>
                ` : ''}
                
                <!-- Модальное окно для добавления задачи -->
                <div id="taskModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; border-radius: var(--radius-lg); padding: 32px; max-width: 500px; width: 90%;">
                        <h3 style="margin-bottom: 20px;">Новая задача</h3>
                        <input type="text" id="taskTitle" placeholder="Название задачи" class="input" style="margin-bottom: 16px;">
                        <select id="taskType" class="input" style="margin-bottom: 16px;">
                            <option value="health">🏃‍♀️ Здоровье</option>
                            <option value="household">🏠 Домашние дела</option>
                            <option value="custom">✨ Своя привычка</option>
                        </select>
                        <input type="number" id="taskPoints" placeholder="Баллы" value="10" class="input" style="margin-bottom: 24px;">
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button class="btn btn-secondary" id="closeModalBtn">Отмена</button>
                            <button class="btn btn-primary" id="saveTaskBtn">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderTaskCard(task, isCompleted = false) {
        const typeIcons = {
            health: '🏃‍♀️',
            household: '🏠',
            custom: '✨'
        };
        
        return `
            <div class="card" data-task-id="${task.id}" style="display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                    <div style="width: 40px; height: 40px; background: var(--color-primary-light); border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        ${typeIcons[task.type] || '📌'}
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 500; ${isCompleted ? 'text-decoration: line-through; color: var(--color-text-light);' : ''}">
                            ${task.title}
                        </div>
                        <div style="font-size: var(--font-size-xs); color: var(--color-text-light);">
                            +${task.points} баллов
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    ${!isCompleted ? `
                        <button class="complete-task" data-id="${task.id}" style="background: var(--color-success); width: 36px; height: 36px; border-radius: var(--radius-full); font-size: 16px;">
                            ✓
                        </button>
                    ` : ''}
                    <button class="delete-task" data-id="${task.id}" style="background: var(--color-error); width: 36px; height: 36px; border-radius: var(--radius-full); font-size: 16px;">
                        ✗
                    </button>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const addBtn = document.getElementById('addTaskBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showModal());
        }
        
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideModal());
        }
        
        const saveTaskBtn = document.getElementById('saveTaskBtn');
        if (saveTaskBtn) {
            saveTaskBtn.addEventListener('click', () => this.addNewTask());
        }
        
        document.querySelectorAll('.complete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                this.completeTask(id);
            });
        });
        
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                this.deleteTask(id);
            });
        });
    }

    showModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideModal() {
        const modal = document.getElementById('taskModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskType').value = 'health';
            document.getElementById('taskPoints').value = '10';
        }
    }

    addNewTask() {
        const title = document.getElementById('taskTitle').value;
        const type = document.getElementById('taskType').value;
        const points = parseInt(document.getElementById('taskPoints').value);
        
        if (!title) {
            alert('Введите название задачи');
            return;
        }
        
        const newTask = {
            id: Date.now().toString(),
            title,
            type,
            completed: false,
            points,
            date: new Date().toISOString()
        };
        
        this.dataService.saveTask(newTask);
        this.hideModal();
        this.render(this.container);
    }

    completeTask(id) {
        this.dataService.updateTask(id, { completed: true });
        this.render(this.container);
    }

    deleteTask(id) {
        if (confirm('Удалить задачу?')) {
            this.dataService.deleteTask(id);
            this.render(this.container);
        }
    }
}
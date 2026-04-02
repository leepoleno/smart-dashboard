import { UIContainer } from './core/uiContainer.js';
import { Router } from './core/router.js';
import { TasksModule } from './modules/tasks/tasks.js';
import { NotesModule } from './modules/notes/notes.js';
import { TrackerModule } from './modules/tracker/tracker.js';

// Инициализация UI контейнера
const uiContainer = new UIContainer();
const contentContainer = uiContainer.render();

// Инициализация модулей
const tasksModule = new TasksModule(contentContainer);
const notesModule = new NotesModule(contentContainer);
const trackerModule = new TrackerModule(contentContainer);

// Настройка маршрутизации
const routes = {
    '/tasks': { component: tasksModule, container: contentContainer },
    '/notes': { component: notesModule, container: contentContainer },
    '/tracker': { component: trackerModule, container: contentContainer }
};

const router = new Router(routes);

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./serviceWorker.js')
            .then(reg => console.log('Service Worker registered:', reg))
            .catch(err => console.log('Service Worker error:', err));
    });
}

console.log('Smart Dashboard запущен!');
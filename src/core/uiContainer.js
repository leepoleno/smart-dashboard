export class UIContainer {
    constructor() {
        this.container = null;
    }

    render() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="app">
                <header class="header">
                    <div class="header-content">
                        <h1 class="logo">✨ Smart Dashboard</h1>
                        <div class="user-info">
                            <div class="user-avatar">👤</div>
                            <span class="user-name">Пользователь</span>
                        </div>
                    </div>
                </header>
                <nav class="nav">
                    <ul class="nav-menu" id="nav-menu">
                        <li><a href="#/tasks" class="nav-item" data-route="tasks">📋 Задачи</a></li>
                        <li><a href="#/notes" class="nav-item" data-route="notes">📝 Заметки</a></li>
                        <li><a href="#/tracker" class="nav-item" data-route="tracker">📊 Прогресс</a></li>
                    </ul>
                </nav>
                <main class="main-content" id="main-content"></main>
                <footer class="footer">
                    <p>Smart Dashboard — ваш персональный помощник</p>
                </footer>
            </div>
        `;
        
        this.container = document.getElementById('main-content');
        return this.container;
    }

    getContentContainer() {
        return this.container;
    }
}
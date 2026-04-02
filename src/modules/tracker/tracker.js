import { DataService } from '../../core/dataService.js';

export class TrackerModule {
    constructor(container) {
        this.container = container;
        this.dataService = new DataService();
    }

    async render(container) {
        this.container = container;
        this.renderUI();
        this.updateStats();
    }

    renderUI() {
        this.container.innerHTML = `
            <div class="fade-in">
                <h2 style="font-size: var(--font-size-2xl); font-weight: 600; margin-bottom: 24px;">
                    📊 Мой прогресс
                </h2>
                
                <!-- Статистика -->
                <div id="statsContainer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px;">
                    <div class="card" style="text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">⭐</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--color-primary);" id="totalPoints">0</div>
                        <div style="color: var(--color-text-light);">Всего баллов</div>
                    </div>
                    <div class="card" style="text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">📅</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--color-primary);" id="todayPoints">0</div>
                        <div style="color: var(--color-text-light);">Сегодня</div>
                    </div>
                    <div class="card" style="text-align: center;">
                        <div style="font-size: 32px; margin-bottom: 8px;">🔥</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--color-primary);" id="streak">0</div>
                        <div style="color: var(--color-text-light);">Дней подряд</div>
                    </div>
                </div>
                
                <!-- Маскот -->
                <div class="card" style="text-align: center; background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-secondary-light) 100%); margin-bottom: 32px;">
                    <div style="font-size: 64px; margin-bottom: 16px;" id="mascot">🦊</div>
                    <div style="font-size: var(--font-size-lg); font-weight: 500;" id="mascotMessage">Продолжай в том же духе!</div>
                </div>
                
                <!-- Прогресс-бар -->
                <div class="card">
                    <h3 style="margin-bottom: 16px;">🎯 Прогресс к цели</h3>
                    <div style="background: var(--color-border); border-radius: var(--radius-full); height: 12px; overflow: hidden;">
                        <div id="progressBar" style="width: 0%; height: 100%; background: linear-gradient(90deg, var(--color-primary), var(--color-secondary)); transition: width var(--transition-base);"></div>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 12px; color: var(--color-text-light);">
                        <span>0 баллов</span>
                        <span id="progressText">0/1000</span>
                        <span>1000 баллов</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateStats() {
        const totalPoints = this.dataService.getTotalPoints();
        const todayPoints = this.dataService.getTodayPoints();
        const streak = this.dataService.getStreak();
        
        const totalPointsEl = document.getElementById('totalPoints');
        const todayPointsEl = document.getElementById('todayPoints');
        const streakEl = document.getElementById('streak');
        
        if (totalPointsEl) totalPointsEl.textContent = totalPoints;
        if (todayPointsEl) todayPointsEl.textContent = todayPoints;
        if (streakEl) streakEl.textContent = streak;
        
        // Update progress bar (goal: 1000 points)
        const percentage = Math.min((totalPoints / 1000) * 100, 100);
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressText) progressText.textContent = `${totalPoints}/1000`;
        
        // Update mascot message
        this.updateMascotMessage(totalPoints, streak);
    }

    updateMascotMessage(points, streak) {
        const mascot = document.getElementById('mascot');
        const message = document.getElementById('mascotMessage');
        
        if (streak >= 7) {
            mascot.textContent = '🦊✨';
            message.textContent = '🔥 Невероятно! 7 дней подряд! Ты супер звезда!';
        } else if (streak >= 3) {
            mascot.textContent = '🦊⭐';
            message.textContent = 'Отлично! Продолжай в том же духе!';
        } else if (streak >= 1) {
            mascot.textContent = '🦊💪';
            message.textContent = 'Хороший день! Так держать!';
        } else if (points > 0) {
            mascot.textContent = '🦊😊';
            message.textContent = 'Ты молодец! Завтра тоже жду твоих успехов!';
        } else {
            mascot.textContent = '🦊🌱';
            message.textContent = 'Начни с небольшой задачи, у тебя всё получится!';
        }
    }
}
const STORAGE_KEYS = {
    TASKS: 'smart_dashboard_tasks',
    NOTES: 'smart_dashboard_notes',
    ACTIVITY: 'smart_dashboard_activity',
    USER: 'smart_dashboard_user'
};

export class DataService {
    constructor() {
        this.initStorage();
    }

    initStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(this.getMockTasks()));
        }
        if (!localStorage.getItem(STORAGE_KEYS.NOTES)) {
            localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(this.getMockNotes()));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY)) {
            localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify([]));
        }
    }

    getMockTasks() {
        return [
            { id: '1', title: '🏃‍♀️ Утренняя зарядка', type: 'health', completed: false, points: 10, date: new Date().toISOString() },
            { id: '2', title: '🧹 Убрать в комнате', type: 'household', completed: false, points: 15, date: new Date().toISOString() },
            { id: '3', title: '💧 Выпить 2л воды', type: 'health', completed: true, points: 10, date: new Date().toISOString() },
            { id: '4', title: '📚 Почитать книгу', type: 'custom', completed: false, points: 20, date: new Date().toISOString() }
        ];
    }

    getMockNotes() {
        return [
            { id: '1', title: 'Идея для проекта', content: 'Создать приложение для учета привычек', date: new Date().toISOString(), points: 5 },
            { id: '2', title: 'Список покупок', content: 'Молоко, хлеб, яйца, фрукты', date: new Date().toISOString(), points: 5 }
        ];
    }

    // Task methods
    getTasks() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.TASKS) || '[]');
    }

    saveTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
        this.addActivity({ action: 'create_task', points: task.points });
        return task;
    }

    updateTask(taskId, updates) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(t => t.id === taskId);
        if (index !== -1) {
            const oldTask = tasks[index];
            tasks[index] = { ...oldTask, ...updates };
            localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
            
            if (updates.completed && !oldTask.completed) {
                this.addActivity({ action: 'complete_task', points: oldTask.points });
            }
            return tasks[index];
        }
        return null;
    }

    deleteTask(taskId) {
        const tasks = this.getTasks();
        const filtered = tasks.filter(t => t.id !== taskId);
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
    }

    // Note methods
    getNotes() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTES) || '[]');
    }

    saveNote(note) {
        const notes = this.getNotes();
        notes.push(note);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
        this.addActivity({ action: 'create_note', points: note.points });
        return note;
    }

    deleteNote(noteId) {
        const notes = this.getNotes();
        const filtered = notes.filter(n => n.id !== noteId);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(filtered));
    }

    // Activity methods
    getActivities() {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITY) || '[]');
    }

    addActivity(activity) {
        const activities = this.getActivities();
        activities.push({
            ...activity,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
    }

    getTotalPoints() {
        const tasks = this.getTasks();
        const completedPoints = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.points, 0);
        const notesPoints = this.getNotes().reduce((sum, n) => sum + n.points, 0);
        return completedPoints + notesPoints;
    }

    getTodayPoints() {
        const today = new Date().toDateString();
        const activities = this.getActivities();
        const todayActivities = activities.filter(a => new Date(a.timestamp).toDateString() === today);
        return todayActivities.reduce((sum, a) => sum + (a.points || 0), 0);
    }

    getStreak() {
        const activities = this.getActivities();
        const uniqueDates = [...new Set(activities.map(a => new Date(a.timestamp).toDateString()))];
        uniqueDates.sort((a, b) => new Date(b) - new Date(a));
        
        let streak = 0;
        let currentDate = new Date();
        
        for (let i = 0; i < uniqueDates.length; i++) {
            const activityDate = new Date(uniqueDates[i]);
            const diffDays = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));
            if (diffDays === streak) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }
}
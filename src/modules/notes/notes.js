import { DataService } from '../../core/dataService.js';

export class NotesModule {
    constructor(container) {
        this.container = container;
        this.dataService = new DataService();
        this.notes = [];
    }

    async render(container) {
        this.container = container;
        this.loadNotes();
        this.renderUI();
        this.attachEvents();
    }

    loadNotes() {
        this.notes = this.dataService.getNotes();
    }

    renderUI() {
        this.container.innerHTML = `
            <div class="fade-in">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <h2 style="font-size: var(--font-size-2xl); font-weight: 600;">📝 Мои заметки</h2>
                    <button class="btn btn-primary" id="addNoteBtn">+ Новая заметка</button>
                </div>
                
                <div id="notesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    ${this.notes.map(note => this.renderNoteCard(note)).join('')}
                </div>
                
                <!-- Модальное окно -->
                <div id="noteModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); align-items: center; justify-content: center; z-index: 1000;">
                    <div style="background: white; border-radius: var(--radius-lg); padding: 32px; max-width: 500px; width: 90%;">
                        <h3 style="margin-bottom: 20px;">Новая заметка</h3>
                        <input type="text" id="noteTitle" placeholder="Заголовок" class="input" style="margin-bottom: 16px;">
                        <textarea id="noteContent" placeholder="Содержание..." class="input" rows="4" style="margin-bottom: 24px;"></textarea>
                        <div style="display: flex; gap: 12px; justify-content: flex-end;">
                            <button class="btn btn-secondary" id="closeModalBtn">Отмена</button>
                            <button class="btn btn-primary" id="saveNoteBtn">Сохранить</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderNoteCard(note) {
        return `
            <div class="card" data-note-id="${note.id}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                    <h3 style="font-size: var(--font-size-lg); font-weight: 600;">${note.title}</h3>
                    <button class="delete-note" data-id="${note.id}" style="color: var(--color-error); font-size: 18px;">✗</button>
                </div>
                <p style="color: var(--color-text-light); line-height: 1.5; margin-bottom: 12px;">${note.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: var(--font-size-xs); color: var(--color-text-lighter);">
                        ${new Date(note.date).toLocaleDateString()}
                    </span>
                    <span style="font-size: var(--font-size-xs); color: var(--color-primary);">
                        +${note.points} баллов
                    </span>
                </div>
            </div>
        `;
    }

    attachEvents() {
        const addBtn = document.getElementById('addNoteBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.showModal());
        }
        
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => this.hideModal());
        }
        
        const saveNoteBtn = document.getElementById('saveNoteBtn');
        if (saveNoteBtn) {
            saveNoteBtn.addEventListener('click', () => this.addNewNote());
        }
        
        document.querySelectorAll('.delete-note').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                this.deleteNote(id);
            });
        });
    }

    showModal() {
        const modal = document.getElementById('noteModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    hideModal() {
        const modal = document.getElementById('noteModal');
        if (modal) {
            modal.style.display = 'none';
            document.getElementById('noteTitle').value = '';
            document.getElementById('noteContent').value = '';
        }
    }

    addNewNote() {
        const title = document.getElementById('noteTitle').value;
        const content = document.getElementById('noteContent').value;
        
        if (!title) {
            alert('Введите заголовок заметки');
            return;
        }
        
        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            points: 5,
            date: new Date().toISOString()
        };
        
        this.dataService.saveNote(newNote);
        this.hideModal();
        this.render(this.container);
    }

    deleteNote(id) {
        if (confirm('Удалить заметку?')) {
            this.dataService.deleteNote(id);
            this.render(this.container);
        }
    }
}
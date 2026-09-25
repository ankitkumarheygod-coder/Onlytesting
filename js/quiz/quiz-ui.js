import { QuizEngine } from './quiz-engine.js';
import { NotesUI } from '../notes/notes-ui.js';
import { events } from '../core/event-bus.js';
import { State } from '../core/state.js';

export const QuizUI = {
    init() {
        events.on('QUESTION_LOADED', this.renderQuestion.bind(this));
        events.on('ANSWER_RESULT', this.handleResult.bind(this));
    },
    renderQuestion(q) {
        const cycle = State.current.revision.currentCycle;
        document.getElementById('quiz-progress').textContent = `Question: ${cycle.currentQuestionIndex + 1} / ${cycle.inProgressIds.length}`;
        
        const container = document.getElementById('quiz-container');
        container.innerHTML = `
            <div class="question-text">${q.question}</div>
            <div class="options-grid">
                ${q.options.map(opt => `
                    <button class="option-btn" data-id="${opt.id}">${opt.text}</button>
                `).join('')}
            </div>
        `;
        
        container.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Disable double clicking
                container.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
                const selectedId = e.target.getAttribute('data-id');
                QuizEngine.submitAnswer(selectedId);
            });
        });
    },
    handleResult(res) {
        if (res.correct) {
            setTimeout(() => QuizEngine.loadNext(), 500);
        } else {
            NotesUI.showNotes(res.conceptId, () => {
                QuizEngine.loadNext();
            });
        }
    }
};

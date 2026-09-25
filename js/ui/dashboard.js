import { State } from '../core/state.js';
import { Router } from '../core/router.js';
import { QuestionSelector } from '../learning/question-selector.js';
import { QuizEngine } from '../quiz/quiz-engine.js';
import { RevisionTracker } from '../revision/revision-tracker.js';
import { config } from '../config/learning-config.js';
import { events } from '../core/event-bus.js';

export const DashboardUI = {
    init() {
        this.render();
        document.getElementById('start-revision-btn').addEventListener('click', () => {
            const cycle = State.current.revision.currentCycle;
            if (!cycle.inProgressIds || cycle.inProgressIds.length === 0) {
                const batch = QuestionSelector.generateBatch(cycle.batchSize);
                cycle.inProgressIds = batch;
                State.save();
            }
            Router.navigate('view-quiz');
            QuizEngine.start(cycle.inProgressIds);
        });

        events.on('BATCH_COMPLETED', () => {
            Router.navigate('view-dashboard');
            RevisionTracker.progressDay();
            this.render();
        });
        
        events.on('REVISION_DAY_FAILED', (data) => {
            alert(`⚠️ Score: ${(data.scoreRatio * 100).toFixed(0)}%\n${config.revision.passPercentage*100}% (90% Rule) आवश्यक है।\nफिर से Revision आवश्यक!`);
            this.render();
        });
    },
    render() {
        const rev = State.current.revision;
        const dash = document.getElementById('dashboard-content');
        
        if (rev.status === 'ACTIVE') {
            const cycle = rev.currentCycle;
            dash.innerHTML = `
                <div class="card warning-card">
                    <h2>📚 Revision आवश्यक है</h2>
                    <p>इस महीने की पढ़ाई का Revision पूरा करें।</p>
                    <p>Revision Day <strong>${cycle.day} / ${config.revision.daysInCycle}</strong></p>
                    <p>Accuracy Target: <strong>${config.revision.passPercentage * 100}%</strong></p>
                    ${cycle.currentQuestionIndex > 0 ? `<p>Progress: ${cycle.currentQuestionIndex} / ${cycle.inProgressIds.length}</p>` : ''}
                </div>
            `;
            document.getElementById('start-revision-btn').textContent = cycle.currentQuestionIndex > 0 ? 'Resume Revision' : 'Start Revision';
            document.getElementById('start-revision-btn').style.display = 'block';
            document.getElementById('normal-mode-msg').style.display = 'none';
        } else {
            dash.innerHTML = `
                <div class="card success-card">
                    <h2>✅ Normal Mode Unlocked</h2>
                    <p>आपने अपना Revision पूरा कर लिया है!</p>
                </div>
            `;
            document.getElementById('start-revision-btn').style.display = 'none';
            document.getElementById('normal-mode-msg').style.display = 'block';
        }
    }
};

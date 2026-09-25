import { State } from '../core/state.js';
import { RevisionTracker } from '../revision/revision-tracker.js';
import { DashboardUI } from '../ui/dashboard.js';

export const DebugPanel = {
    init() {
        const panel = document.getElementById('debug-panel');
        panel.innerHTML = `
            <h3>🛠 DEBUG MODE</h3>
            <button id="dbg-month">Simulate Month Passed</button>
            <button id="dbg-reset">Reset Test Data</button>
            <button id="dbg-pass">Force Day Pass</button>
        `;
        
        document.getElementById('dbg-month').onclick = () => {
            State.current.revision.nextRevisionDueAt = Date.now() - 1000;
            State.save();
            RevisionTracker.checkMonthlyDue();
            DashboardUI.render();
        };
        
        document.getElementById('dbg-reset').onclick = () => {
            State.reset();
            location.reload();
        };

        document.getElementById('dbg-pass').onclick = () => {
            const cycle = State.current.revision.currentCycle;
            cycle.completedQuestions = cycle.batchSize;
            cycle.correctAnswers = cycle.batchSize; // 100%
            RevisionTracker.progressDay();
            DashboardUI.render();
        };
    }
};

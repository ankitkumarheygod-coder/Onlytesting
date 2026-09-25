import { State } from './core/state.js';
import { ManifestLoader } from './content/manifest-loader.js';
import { RevisionTracker } from './revision/revision-tracker.js';
import { DashboardUI } from './ui/dashboard.js';
import { QuizUI } from './quiz/quiz-ui.js';
import { DebugPanel } from './debug/debug-panel.js';
import { Router } from './core/router.js';
import { events } from './core/event-bus.js';

async function bootstrap() {
    try {
        State.init();
        await ManifestLoader.init();
        
        QuizUI.init();
        DashboardUI.init();
        DebugPanel.init();

        events.on('DATA_ERROR', (err) => {
            document.getElementById('error-screen').classList.add('active');
            document.getElementById('error-msg').textContent = err.message;
        });

        // App lifecycle check
        RevisionTracker.checkMonthlyDue();
        
        // Auto-resume logic
        const cycle = State.current.revision.currentCycle;
        if (State.current.revision.status === 'ACTIVE' && cycle.inProgressIds && cycle.inProgressIds.length > 0 && cycle.currentQuestionIndex < cycle.inProgressIds.length) {
            Router.navigate('view-dashboard'); // User chooses to resume
        } else {
            Router.navigate('view-dashboard');
        }

    } catch (e) {
        console.error("Bootstrap failed", e);
    }
}

window.addEventListener('DOMContentLoaded', bootstrap);

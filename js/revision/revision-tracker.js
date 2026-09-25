import { State } from '../core/state.js';
import { config } from '../config/learning-config.js';
import { events } from '../core/event-bus.js';

export const RevisionTracker = {
    checkMonthlyDue() {
        const rev = State.current.revision;
        const now = Date.now();
        if (rev.status === 'COMPLETED' || !rev.lastRevisionCompletedAt) {
            const timeSince = now - (rev.lastRevisionCompletedAt || 0);
            const cycleMs = config.revision.monthlyCycleDays * 24 * 60 * 60 * 1000;
            
            if (timeSince >= cycleMs || rev.nextRevisionDueAt <= now) {
                this.lockNormalMode();
            }
        }
    },
    lockNormalMode() {
        State.current.revision.status = 'ACTIVE';
        State.current.revision.currentCycle = {
            day: 1, batchSize: config.revision.defaultBatchSize,
            currentQuestionIndex: 0, completedQuestions: 0, correctAnswers: 0,
            remediationRequired: [], weakConcepts: [], inProgressIds: []
        };
        State.save();
        events.emit('REVISION_REQUIRED');
    },
    progressDay() {
        const cycle = State.current.revision.currentCycle;
        const scoreRatio = cycle.correctAnswers / cycle.batchSize;
        
        if (scoreRatio >= config.revision.passPercentage) {
            cycle.day++;
            cycle.completedQuestions = 0;
            cycle.correctAnswers = 0;
            cycle.currentQuestionIndex = 0;
            cycle.inProgressIds = [];
            
            if (cycle.day > config.revision.daysInCycle) {
                this.completeRevision();
            } else {
                events.emit('REVISION_DAY_COMPLETED', cycle.day - 1);
            }
        } else {
            // Failed 90% rule, repeat day
            cycle.completedQuestions = 0;
            cycle.correctAnswers = 0;
            cycle.currentQuestionIndex = 0;
            cycle.inProgressIds = [];
            events.emit('REVISION_DAY_FAILED', { scoreRatio });
        }
        State.save();
    },
    completeRevision() {
        State.current.revision.status = 'COMPLETED';
        State.current.revision.lastRevisionCompletedAt = Date.now();
        State.current.revision.nextRevisionDueAt = Date.now() + (config.revision.monthlyCycleDays * 24 * 60 * 60 * 1000);
        State.save();
        events.emit('NORMAL_MODE_UNLOCKED');
    }
};

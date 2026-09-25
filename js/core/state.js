import { Storage } from './storage.js';

const defaultState = {
    userProfile: { xp: 0, level: 1 },
    learning: { chapters: {}, concepts: {} },
    mistakes: {},
    mastery: {},
    revision: {
        status: "ACTIVE", // Start with ACTIVE to test monthly lock if needed, usually normal
        nextRevisionDueAt: Date.now() - 1000, // Due immediately for testing
        lastRevisionCompletedAt: null,
        currentCycle: {
            day: 1,
            batchSize: 50,
            currentQuestionIndex: 0,
            completedQuestions: 0,
            correctAnswers: 0,
            remediationRequired: [],
            weakConcepts: [],
            inProgressIds: []
        },
        recentQuestionIds: []
    }
};

export const State = {
    current: null,
    init() {
        const saved = Storage.get();
        this.current = saved ? saved.data : JSON.parse(JSON.stringify(defaultState));
    },
    save() {
        Storage.set(this.current);
    },
    reset() {
        this.current = JSON.parse(JSON.stringify(defaultState));
        this.save();
    }
};

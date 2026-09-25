export const config = {
    storageVersion: 1,
    storageKey: 'crystal_land_learning_v1',
    debugMode: true,
    revision: {
        passPercentage: 0.90, // 90% rule
        remediationThreshold: 0.80,
        daysInCycle: 4,
        defaultBatchSize: 50,
        workloadLevels: [30, 50, 60, 70, 80, 90, 120, 140, 150, 170, 180, 200],
        maxWorkload: 200,
        monthlyCycleDays: 30
    },
    mastery: {
        correctWeight: 10,
        wrongPenalty: -15,
        repeatedMistakePenalty: -5,
        recoveryBonus: 12,
        minimumAttempts: 3,
        threshold: 85,
        decayRatePerDay: 0.5 // Subtract from currentRecall
    },
    weights: {
        repeatedWrong: 50,
        recentlyWrong: 30,
        weak: 15,
        unseen: 5
    },
    recentQuestionHistoryLimit: 50
};

import { State } from '../core/state.js';
import { config } from '../config/learning-config.js';

export const MasterySystem = {
    updateMastery(conceptId, isCorrect, isRepeatedMistake) {
        let mastery = State.current.mastery[conceptId];
        if (!mastery) {
            mastery = { lifetimeMastery: 50, currentRecall: 50, attempts: 0, lastUpdated: Date.now() };
        }
        
        this.applyDecay(mastery);
        
        mastery.attempts++;
        if (isCorrect) {
            mastery.lifetimeMastery = Math.min(100, mastery.lifetimeMastery + config.mastery.correctWeight);
            mastery.currentRecall = Math.min(100, mastery.currentRecall + config.mastery.recoveryBonus);
        } else {
            let penalty = config.mastery.wrongPenalty + (isRepeatedMistake ? config.mastery.repeatedMistakePenalty : 0);
            mastery.currentRecall = Math.max(0, mastery.currentRecall + penalty);
        }
        
        mastery.lastUpdated = Date.now();
        State.current.mastery[conceptId] = mastery;
        State.save();
    },
    applyDecay(masteryRecord) {
        const daysPassed = (Date.now() - masteryRecord.lastUpdated) / (1000 * 60 * 60 * 24);
        if (daysPassed > 1) {
            masteryRecord.currentRecall = Math.max(0, masteryRecord.currentRecall - (daysPassed * config.mastery.decayRatePerDay));
        }
    }
};

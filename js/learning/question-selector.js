import { ManifestLoader } from '../content/manifest-loader.js';
import { State } from '../core/state.js';
import { config } from '../config/learning-config.js';

export const QuestionSelector = {
    generateBatch(size) {
        const allQuestions = ManifestLoader.getAllQuestions();
        const scored = allQuestions.map(q => {
            let score = 0;
            const mistake = State.current.mistakes[q.id];
            const mastery = State.current.mastery[q.conceptId];
            
            if (State.current.revision.recentQuestionIds.includes(q.id)) score -= 100; // Avoid exact duplicates
            
            if (mistake && mistake.consecutiveWrong > 1) score += config.weights.repeatedWrong;
            else if (mistake && mistake.status === 'REVISION_REQUIRED') score += config.weights.recentlyWrong;
            
            if (mastery && mastery.currentRecall < config.mastery.threshold) score += config.weights.weak;
            
            if (!mistake && (!mastery || mastery.attempts === 0)) score += config.weights.unseen;
            
            return { q, score: score + (Math.random() * 5) }; // Add slight randomness
        });

        scored.sort((a, b) => b.score - a.score);
        const batch = scored.slice(0, size).map(item => item.q.id);
        
        // Update recent history
        State.current.revision.recentQuestionIds = [...batch, ...State.current.revision.recentQuestionIds].slice(0, config.recentQuestionHistoryLimit);
        State.save();
        
        return batch;
    }
};

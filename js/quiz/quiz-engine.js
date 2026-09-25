import { State } from '../core/state.js';
import { ManifestLoader } from '../content/manifest-loader.js';
import { QuizRules } from './quiz-rules.js';
import { MistakeTracker } from '../learning/mistake-tracker.js';
import { MasterySystem } from '../learning/mastery-system.js';
import { events } from '../core/event-bus.js';

export const QuizEngine = {
    currentQuestion: null,
    
    start(questionIds) {
        const cycle = State.current.revision.currentCycle;
        if (!cycle.inProgressIds || cycle.inProgressIds.length === 0) {
            cycle.inProgressIds = questionIds;
            State.save();
        }
        this.loadNext();
    },
    
    loadNext() {
        const cycle = State.current.revision.currentCycle;
        if (cycle.currentQuestionIndex >= cycle.inProgressIds.length) {
            events.emit('BATCH_COMPLETED');
            return;
        }
        const qId = cycle.inProgressIds[cycle.currentQuestionIndex];
        const rawQ = ManifestLoader.getQuestion(qId);
        this.currentQuestion = QuizRules.shuffleOptions(rawQ);
        events.emit('QUESTION_LOADED', this.currentQuestion);
    },
    
    submitAnswer(selectedId) {
        const isCorrect = QuizRules.checkAnswer(this.currentQuestion, selectedId);
        const q = this.currentQuestion;
        
        const mistakeRecord = State.current.mistakes[q.id];
        const isRepeatedMistake = mistakeRecord && mistakeRecord.wrongCount > 0;

        MasterySystem.updateMastery(q.conceptId, isCorrect, isRepeatedMistake);
        
        const cycle = State.current.revision.currentCycle;
        cycle.completedQuestions++;

        if (isCorrect) {
            MistakeTracker.recordCorrect(q.id);
            cycle.correctAnswers++;
            events.emit('ANSWER_RESULT', { correct: true });
        } else {
            MistakeTracker.recordMistake(q.id, q.conceptId);
            events.emit('ANSWER_RESULT', { correct: false, conceptId: q.conceptId });
        }
        
        cycle.currentQuestionIndex++;
        State.save();
    }
};

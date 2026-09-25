import { State } from '../core/state.js';
import { events } from '../core/event-bus.js';

export const MistakeTracker = {
    recordMistake(questionId, conceptId) {
        let mistake = State.current.mistakes[questionId];
        if (!mistake) {
            mistake = { 
                questionId, conceptId, wrongCount: 0, consecutiveWrong: 0, 
                status: 'NEW', lastWrongAt: null, lastCorrectAt: null 
            };
        }
        
        mistake.wrongCount++;
        mistake.consecutiveWrong++;
        mistake.lastWrongAt = Date.now();
        
        if (mistake.consecutiveWrong >= 2) mistake.status = 'WEAK';
        else mistake.status = 'REVISION_REQUIRED';
        
        State.current.mistakes[questionId] = mistake;
        State.save();
        events.emit('MISTAKE_CREATED', mistake);
        events.emit('CONCEPT_WEAKENED', conceptId);
    },
    recordCorrect(questionId) {
        let mistake = State.current.mistakes[questionId];
        if (mistake) {
            mistake.consecutiveWrong = 0;
            mistake.lastCorrectAt = Date.now();
            if (mistake.status === 'WEAK' || mistake.status === 'REVISION_REQUIRED') {
                mistake.status = 'RECOVERING';
            } else if (mistake.status === 'RECOVERING') {
                mistake.status = 'MASTERED';
            }
            State.current.mistakes[questionId] = mistake;
            State.save();
        }
    }
};

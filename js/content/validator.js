import { events } from '../core/event-bus.js';

export const Validator = {
    validateManifest(data) {
        if (!data || !data.chapters) this.fail('Manifest में chapters missing हैं।');
        return true;
    },
    validateQuestions(questions, file) {
        const ids = new Set();
        questions.forEach((q, i) => {
            if (!q.id) this.fail(`File: ${file} - Index ${i} में Question ID missing है।`);
            if (ids.has(q.id)) this.fail(`File: ${file} - Duplicate ID found: ${q.id}`);
            if (!q.conceptId) this.fail(`File: ${file} - Question ${q.id} में conceptId missing है।`);
            if (!q.options || q.options.length < 2) this.fail(`File: ${file} - Question ${q.id} में options invalid हैं।`);
            if (!q.correctAnswerId) this.fail(`File: ${file} - Question ${q.id} में correctAnswerId missing है।`);
            ids.add(q.id);
        });
        return true;
    },
    fail(message) {
        events.emit('DATA_ERROR', { message });
        throw new Error(`Data Validation Error: ${message}`);
    }
};

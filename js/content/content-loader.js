import { Validator } from './validator.js';

export const ContentLoader = {
    async fetchJSON(path) {
        try {
            const res = await fetch(path);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (error) {
            Validator.fail(`File load fail: ${path}. Server error or file missing.`);
        }
    },
    async loadQuestions(chapter) {
        const data = await this.fetchJSON(chapter.questionFile);
        Validator.validateQuestions(data, chapter.questionFile);
        return data;
    },
    async loadNotes(chapter) {
        const data = await this.fetchJSON(chapter.notesFile);
        return data;
    }
};

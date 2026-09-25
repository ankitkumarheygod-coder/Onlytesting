import { ContentLoader } from './content-loader.js';
import { Validator } from './validator.js';

export const ManifestLoader = {
    cache: { questions: [], notes: [] },
    async init() {
        const manifest = await ContentLoader.fetchJSON('content/manifests/content-index.json');
        Validator.validateManifest(manifest);
        
        // Lazy load strategy: Load enabled chapters
        for (const chapter of manifest.chapters.filter(c => c.enabled)) {
            const qData = await ContentLoader.loadQuestions(chapter);
            const nData = await ContentLoader.loadNotes(chapter);
            this.cache.questions.push(...qData);
            this.cache.notes.push(...nData);
        }
    },
    getQuestion(id) { return this.cache.questions.find(q => q.id === id); },
    getQuestionsByConcept(cId) { return this.cache.questions.filter(q => q.conceptId === cId); },
    getAllQuestions() { return this.cache.questions; },
    getNotes(conceptId) { return this.cache.notes.find(n => n.conceptId === conceptId); }
};

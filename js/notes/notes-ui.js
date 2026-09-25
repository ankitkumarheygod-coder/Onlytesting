import { ManifestLoader } from '../content/manifest-loader.js';

export const NotesUI = {
    showNotes(conceptId, onContinue) {
        const notes = ManifestLoader.getNotes(conceptId);
        if (!notes) return onContinue();
        
        const modal = document.getElementById('notes-modal');
        modal.innerHTML = `
            <div class="notes-card">
                <h3>📚 इस गलती का Revision करें</h3>
                <h2>${notes.title}</h2>
                <p><strong>Summary:</strong> ${notes.summary}</p>
                <ul>${notes.keyPoints.map(kp => `<li>${kp}</li>`).join('')}</ul>
                <div class="notes-warning"><strong>Common Mistake:</strong> ${notes.commonMistakes.join(', ')}</div>
                <button id="notes-continue-btn" class="btn primary">समझ गया (Continue)</button>
            </div>
        `;
        modal.classList.add('active');
        document.getElementById('notes-continue-btn').onclick = () => {
            modal.classList.remove('active');
            onContinue();
        };
    }
};

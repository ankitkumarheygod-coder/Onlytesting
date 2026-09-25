# Crystal Land — Learning & Revision Engine

A standalone, completely modular learning engine testing environment.

## 🏗️ Architecture
- **Vanilla ES Modules:** Strict modular architecture. No bundlers required.
- **`CODE = ENGINE, JSON = CONTENT`:** Everything runs off JSON files mapped through `manifests/content-index.json`. 
- **Central Storage:** `localStorage` is wrapped in versioned controllers.
- **State System:** Managed in `state.js`, no module modifies raw data without State/Event bus patterns.

## ⚙️ How it Works
1. **Mistake Tracking (`mistake-tracker.js`):** Notes if you answer wrong. Status shifts `NEW -> WEAK -> REVISION_REQUIRED -> MASTERED`.
2. **Mastery vs Recall (`mastery-system.js`):** Lifetime mastery persists, but current recall decays.
3. **Monthly Revision Lock (`revision-tracker.js`):** Every 30 days, normal mode locks. 4-day revision cycle begins. 
4. **90% Rule:** You must score 90% in a batch to pass the day. If you fail, the app immediately flags remediation and forces a repeat.
5. **Notes Injection:** When a mistake occurs, Notes are cross-referenced by `conceptId` dynamically and displayed.

## 🚀 How to Run Locally
Because ES Modules and Fetch API block `file://` protocols, use a local server:
- **VS Code:** Install "Live Server" extension -> Right click `index.html` -> Open with Live Server.
- **Python:** Run `python -m http.server 8000` in the directory, visit `http://localhost:8000`.

## 🧪 Acceptance Tests for Revision Systems
- **Test Monthly Lock:** Click `Simulate Month Passed` in the bottom right Debug Panel. The UI will instantly lock and demand Revision.
- **Test 90% Rule:** Modify `learning-config.js` batch size to 2 (if you only have 2 JSON questions loaded). Intentionally answer 1 wrong. The UI will calculate 50% accuracy, fail the day, and show a Hindi alert demanding a repeat.
- **Test Resumability:** Refresh the page halfway through a batch. The app will detect `inProgressIds` and current index, maintaining your place.
- **Data Error Fallback:** Change a `conceptId` to empty string `""` in the JSON. Refresh. The app won't crash silently, it will render a red Hindi error screen pointing exactly to the missing data.

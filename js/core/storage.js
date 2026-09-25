import { config } from '../config/learning-config.js';
import { events } from './event-bus.js';

export const Storage = {
    get() {
        try {
            const data = localStorage.getItem(config.storageKey);
            if (!data) return null;
            const parsed = JSON.parse(data);
            if (parsed.version !== config.storageVersion) return this.migrate(parsed);
            return parsed;
        } catch (e) {
            console.error('Storage read error', e);
            events.emit('STORAGE_CORRUPTED', e);
            return null;
        }
    },
    set(stateData) {
        try {
            const dataToSave = { version: config.storageVersion, data: stateData };
            localStorage.setItem(config.storageKey, JSON.stringify(dataToSave));
            events.emit('STORAGE_UPDATED');
        } catch (e) {
            console.error('Storage write error', e);
        }
    },
    migrate(oldData) {
        // Future migration logic here
        return oldData.data || null;
    },
    clear() {
        localStorage.removeItem(config.storageKey);
    }
};

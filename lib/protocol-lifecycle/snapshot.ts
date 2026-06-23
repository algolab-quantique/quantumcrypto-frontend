import type {RoomSnapshot} from './types';

export const toSerializableSnapshot = (state: Record<string, unknown>): RoomSnapshot => {
    const snapshot: RoomSnapshot = {};

    Object.entries(state).forEach(([key, value]) => {
        if (typeof value !== 'function') {
            snapshot[key] = value;
        }
    });

    return snapshot;
};

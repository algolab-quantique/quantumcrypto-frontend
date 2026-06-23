import {bb84Adapter} from './bb84-adapter';
import {dpsAdapter} from './dps-adapter';
import {e91Adapter} from './e91-adapter';
import type {ProtocolAdapter, ProtocolId} from './types';

export const protocolAdapters = {
    bb84: bb84Adapter,
    e91: e91Adapter,
    dps: dpsAdapter,
} satisfies Record<ProtocolId, ProtocolAdapter>;

export const getProtocolAdapter = (protocolId: ProtocolId): ProtocolAdapter => (
    protocolAdapters[protocolId]
);

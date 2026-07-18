/**
 * ⚠️ SCAFFOLDING — intentionally unused for now (Task 54 F4).
 * No production code imports this yet. Its consumers arrive with the generic
 * PLAYER_LEFT / partner-left dispatch and the Phase-5 socket-handler refactor
 * (ADR §4.5, §6), which need `getProtocolAdapter(gameType)` to route backend
 * events to the right protocol's lifecycle. Kept (rather than deleted) as a
 * labeled breadcrumb for that work; if plans change, delete freely — git
 * remembers.
 */
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

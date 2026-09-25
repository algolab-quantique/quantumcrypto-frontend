export interface inputField {
    value: string,
    touched: boolean,
    error: boolean
}

export interface inputPhaseField {
    values: string[];
    touched: boolean[];
    error: boolean[];
}

export enum BB84GameStep {
    EXCHANGE,
    BASIS,
    VALIDATION,
    MESSAGING,
}

export enum E91GameStep {
    MEASUREMENT,
    BASIS,
    VALIDATION,
    MESSAGING,
}

export enum DPSGameStep {
    EXCHANGE,
    INFERENCE,
    VALIDATION,
    MESSAGING,
}

export interface Line {
    title?: string,
    content?: string,
    extra?: string,
    // Names a popup the line can reopen through an ⓘ button, e.g.
    // 'keyPerturbed' in E91 (Task 71). Optional: most lines have none.
    info?: string,
    // Numbers for {markers} inside the content's translation (Task 72). The
    // line keeps the key and the numbers, not finished text, so it redraws in
    // whichever language is chosen.
    values?: Record<string, string | number>,
}

export type LanguageItem = {
    [key: string]: string;
}

export type Player = {
    name: string;
}

export enum PlayerRole {
    ALICE,
    BOB
}
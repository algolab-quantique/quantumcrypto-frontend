export interface inputField {
    value: string,
    touched: boolean,
    error: boolean
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
    MEASUREMENT,
    BASIS,
    VALIDATION,
    MESSAGING,
}

export interface Line {
    title?: string,
    content?: string,
    extra?: string,
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
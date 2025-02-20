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

export enum GameLines {
    QUANTUMCRYPTO,
    BB84,
    E91,
    DPS,
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
export interface Cell {
    adjacentBears: number,
    isFlagged: boolean,
    isBear: boolean,
    isRevealed: boolean,
    row: number,
    column: number,
    glow: boolean
}


export const CellColors = {
    covered: '#D9C9BA',
    number: '#A68877',
    zero: '#00000000',
    bear: '#00000000',
    flag: '#00000000'
}

export interface Position {
    row: number
    column: number
}

export interface BoardSize {
    rows: number
    columns: number
}

export interface Board {
    cells: Cell[][]
}

export const BoardSizes = {
    small: {rows: 8, columns: 12},
    medium: {rows: 12, columns: 20},
    large: {rows: 16, columns: 32},
}

export enum BearCounts {
    easy = 10,
    moderate = 25,
    hard = 60,
    expert = 100
}

export enum Direction {
    North,
    NorthEast,
    East,
    SouthEast,
    South,
    SouthWest,
    West,
    NorthWest,
}

export const directions = [
    Direction.North,
    Direction.NorthEast,
    Direction.East,
    Direction.SouthEast,
    Direction.South,
    Direction.SouthWest,
    Direction.West,
    Direction.NorthWest,
]


export const Difficulty = {
    easy: {boardSize: BoardSizes.small, numberOfBears: BearCounts.easy},
    moderate: {boardSize: BoardSizes.medium, numberOfBears: BearCounts.moderate},
    hard: {boardSize: BoardSizes.large, numberOfBears: BearCounts.hard},
    expert: {boardSize: BoardSizes.large, numberOfBears: BearCounts.expert},
} as const;

export enum GameDifficulty {
    easy = 'easy',
    moderate = 'moderate',
    hard = 'hard',
    expert = 'expert'
}

export const DifficultyMultipliers = {
    easy: 1000,
    moderate: 3000,
    hard: 5000,
    expert: 10000,
} as const;

export enum GameState {
    lobby = -1,
    playing = 0,
    paused = 1,
    won = 2,
    lost = 3,
}

export interface Cell {
    adjacentMines: number,
    isFlagged: boolean,
    isMine: boolean,
    isRevealed: boolean,
    row: number,
    column: number,
    cell?: Cell
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

export enum MineCounts {
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
    easy: {boardSize: BoardSizes.small, numberOfMines: MineCounts.easy},
    moderate: {boardSize: BoardSizes.medium, numberOfMines: MineCounts.moderate},
    hard: {boardSize: BoardSizes.large, numberOfMines: MineCounts.hard},
    expert: {boardSize: BoardSizes.large, numberOfMines: MineCounts.expert},
} as const;

export enum GameDifficulty {
    easy = 'easy',
    moderate = 'moderate',
    hard = 'hard',
    expert = 'expert'
}

export enum GameState {
    lobby = -1,
    playing = 0,
    paused = 1,
    won = 2,
    lost = 3,
}

export const CellColors = {
    covered: '#D9C9BA',
    number: '#A68877',
    zero: '#00000000',
    mine: '#00000000',
    flag: '#00000000'
}

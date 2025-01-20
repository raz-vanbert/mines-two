// create a 2d array of cells
import {produce} from "immer";
import _ from "lodash";
import {Board, BoardSize, Cell, Difficulty, Direction, directions, GameDifficulty, Position} from "./board.ts";

export const createEmptyBoard = (size: BoardSize): Board => {
    return {
        cells: new Array(size.rows).fill(0).map((_row, rowIndex: number): Cell[] => (
            Array(size.columns).fill(0).map((_column, columnIndex: number): Cell => ({
                row: rowIndex,
                column: columnIndex,
                adjacentBears: 0,
                isFlagged: false,
                isBear: false,
                isRevealed: false
            }))
        ))
    };
}

// takes in a direction and returns a location modifier for the row and column
export const getLocationModifier = (direction: Direction): Position => {
    const result: Position = {row: 0, column: 0};
    // up
    if ([Direction.NorthWest, Direction.North, Direction.NorthEast].includes(direction)) result.row = -1;
    // down
    if ([Direction.SouthWest, Direction.South, Direction.SouthEast].includes(direction)) result.row = 1;
    // left
    if ([Direction.NorthEast, Direction.East, Direction.SouthEast].includes(direction)) result.column = 1;
    // right
    if ([Direction.NorthWest, Direction.West, Direction.SouthWest].includes(direction)) result.column = -1;
    return result;
}

// adds bears in random places on the board
export const placeBears = (board: Board, numberOfBears: number): Board => {
    // create a list of length numberOfBears of random addresses {row:number,column:number}[]
    const randomRows = new Array(numberOfBears).fill(0).map(() => Math.floor(Math.random() * board.cells.length))
    const randomColumns = new Array(numberOfBears).fill(0).map(() => Math.floor(Math.random() * board.cells[0].length))
    // combine (zipper) randomRows and randomColumns into {row:number,column:number}[]
    const randomLocations = randomRows.map((row, colIndex) => ({row, column: randomColumns[colIndex]}));
    // plant the bears on the board using immer
    return produce(board, (draftBoard: Board) => {
        randomLocations.forEach((location) => {
            draftBoard.cells[location.row][location.column].isBear = true
        })
    });
}

// get number of adjacent bears for a cell
export const getAdjacentBears = (board: Board, cell: Cell): Cell[] => {
    return getAllNeighbors(board, cell).filter(neighbor => neighbor.isBear)
}

// toggle isFlagged
export const flagCell = (board: Board, cell: Cell) => {
    return produce(board, draftBoard => {
        draftBoard.cells[cell.row][cell.column].isFlagged = !draftBoard.cells[cell.row][cell.column].isFlagged;
    });
}

// reveal a cell
export const revealCell = (board: Board, cell: Cell) => {
    return produce(board, draftBoard => {
        draftBoard.cells[cell.row][cell.column].isRevealed = true;
    });
}

// get the neighbor cell at a direction
export const getNeighbor = (board: Board, cell: Cell, direction: Direction): Cell | null => {
    const locationModifier = getLocationModifier(direction)
    const neighborLocation = {row: cell.row + locationModifier.row, column: cell.column + locationModifier.column}
    return board.cells.flat().find((c: Cell) => c.row === neighborLocation.row && c.column === neighborLocation.column) || null;
}

// get all neighbors
export const getAllNeighbors = (board: Board, cell: Cell): Cell[] => {
    const neighbors: Cell[] = []
    directions.forEach((direction) => {
        const neighbor = getNeighbor(board, cell, direction);
        if (neighbor) neighbors.push(neighbor);
    })
    return neighbors;
}

export const getUnrevealedNeighbors = (board: Board, cell: Cell) => {
    return getAllNeighbors(board, cell).filter(neighbor => !neighbor.isRevealed)
}

// Flood Reveal with Recursive Depth First Search
export const revealCellAndNeighbors = (board: Board, cell: Cell) => {
    let newBoard = _.cloneDeep(board)
    newBoard = revealCell(newBoard, cell)
    if (cell.adjacentBears > 0) return newBoard

    const unrevealedNeighbors = getUnrevealedNeighbors(board, cell)
    for (const neighbor of unrevealedNeighbors) {
        newBoard = revealCellAndNeighbors(newBoard, neighbor)
    }
    return newBoard
}

export const didWin = (board: Board) => {
    return board.cells.flat().filter(cell => !cell.isRevealed && !cell.isBear).length === 0
}


export const bearCount = (board: Board) => {
    return board.cells.flat().filter(cell => cell.isBear).length
}

export const flagAllHidden = (board: Board) => {
    return produce(board, draftBoard => {
        board.cells.flat().forEach(cell => {
            if (!cell.isRevealed) {
                draftBoard.cells[cell.row][cell.column].isFlagged = true;
            }
        })
    })
}

export const revealAllBears = (board: Board) => {
    return produce(board, draftBoard => {
        board.cells.flat().forEach(cell => {
            if (cell.isBear) {
                draftBoard.cells[cell.row][cell.column].isRevealed = true;
            }
        })
    })
}

// calculate Adjacent Bears for the entire board
export const populateAdjacentBears = (board: Board): Board => {
    return produce(board, draftBoard => {
        board.cells.flat().forEach(cell => {
            const adjacentBears = getAdjacentBears(board, cell);
            draftBoard.cells[cell.row][cell.column].adjacentBears = adjacentBears.length;
        })
    })
}

export const createBoard = (difficulty: GameDifficulty): Board => {
    return populateAdjacentBears(placeBears(createEmptyBoard(Difficulty[difficulty].boardSize), Difficulty[difficulty].numberOfBears))
};

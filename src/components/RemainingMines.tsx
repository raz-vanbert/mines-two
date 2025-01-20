import {Board, Cell} from "../board.ts";

export default function RemainingMines({board}: { board: Board }) {
    const numberOfFlags = board.cells.flat().filter((cell: Cell) => cell.isFlagged).length
    const numberOfMines = board.cells.flat().filter((cell: Cell) => cell.isMine).length
    return <>{numberOfMines - numberOfFlags}</>
}
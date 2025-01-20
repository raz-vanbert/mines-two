import {Board, Cell} from "../board.ts";

export default function RemainingBears({board}: { board: Board }) {
    const numberOfBears = board.cells.flat().filter((cell: Cell) => cell.isBear).length
    const numberOfFlags = board.cells.flat().filter((cell: Cell) => cell.isFlagged).length
    return <>{numberOfBears - numberOfFlags}</>
}
import * as motion from "motion/react-client";
import {Cell, CellColors} from "../board.ts";
import {SyntheticEvent} from "react";

export default function CellBox({cell, onClick, onRightClick}: {
    cell: Cell,
    onClick: (cell: Cell) => void,
    onRightClick: (e: SyntheticEvent, cell: Cell) => void
}) {
    return (<motion.div whileHover={{opacity: 0.8}}
                        whileTap={{scale: 0.9}}
                        style={cellStyle(cell)} onClick={() => onClick(cell)}
                        onContextMenu={(e) => onRightClick(e, cell)}>
        {getCellDisplayValue(cell)}
    </motion.div>)
}

const getCellDisplayValue = (cell: Cell) => {
    if (cell.isFlagged) return '🚩'
    if (!cell.isRevealed) return null
    if (cell.isMine) return '💣'
    if (cell.adjacentMines > 0) return cell.adjacentMines
    return null
}

const getCellColor = (cell: Cell) => {
    if (cell.isFlagged) return CellColors.flag
    if (!cell.isRevealed) return CellColors.covered
    if (cell.adjacentMines === 0) return CellColors.zero
    if (cell.adjacentMines > 0) return CellColors.number
    if (cell.isMine) return CellColors.mine
}

const cellStyle = (cell: Cell) => ({
    width: 24,
    height: 24,
    backgroundColor: getCellColor(cell),
    borderRadius: 5,
    color: '#EEE',
})
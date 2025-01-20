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
    if (cell.isFlagged) return '🍯'
    if (!cell.isRevealed) return null
    if (cell.isBear) return '🐻'
    if (cell.adjacentBears > 0) return cell.adjacentBears
    return null
}

const getCellColor = (cell: Cell) => {
    if (cell.isFlagged) return CellColors.flag
    if (!cell.isRevealed) return CellColors.covered
    if (cell.adjacentBears === 0) return CellColors.zero
    if (cell.adjacentBears > 0) return CellColors.number
    if (cell.isBear) return CellColors.bear
}

const cellStyle = (cell: Cell) => ({
    width: 24,
    height: 24,
    backgroundColor: getCellColor(cell),
    borderRadius: 5,
    color: '#EEE',
})
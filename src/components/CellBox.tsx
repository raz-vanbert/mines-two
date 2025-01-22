import * as motion from "motion/react-client";
import {Cell, CellColors} from "../board.ts";
import {SyntheticEvent, useContext} from "react";
import {GameStateContext} from "../providers/GameStateContext.tsx";
import {glowNeighbors, unGlowNeighbors} from "../boardUtilities.ts";

export default function CellBox({cell, onClick, onRightClick}: {
    cell: Cell,
    onClick: (cell: Cell) => void,
    onRightClick: (e: SyntheticEvent, cell: Cell) => void
}) {
    const gameStateContext = useContext(GameStateContext)
    if (!gameStateContext) {
        throw new Error("GameStateContext used outside GameStateProvider")
    }
    const {board, setBoard} = gameStateContext

    const onHoverStart = () => {
        console.log('hover start')
        if (!cell.isRevealed || cell.isFlagged) return
        setBoard(glowNeighbors(board, cell))
    }

    const onHoverEnd = () => {
        if (!cell.isRevealed || cell.isFlagged) return
        setBoard(unGlowNeighbors(board, cell))
    }

    const cellStyle = {
        width: 32,
        height: 32,
        fontSize: 21,
        backgroundColor: getCellColor(cell),
        borderRadius: 5,
        color: '#EEE',
        transition: 'all 0.25s ease-in-out',
        boxShadow: cell.glow ? 'inset 0px 0px 6px 8px white' : 'none',
    }

    return (<motion.div whileHover={{opacity: 0.8}}
                        whileTap={{scale: 0.9}}
                        onHoverStart={onHoverStart}
                        onHoverEnd={onHoverEnd}
                        style={cellStyle}
                        onClick={() => onClick(cell)}
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
    return CellColors.covered
}
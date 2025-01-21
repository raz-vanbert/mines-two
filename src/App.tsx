import {SyntheticEvent, useContext, useEffect} from "react";
import {Box, Stack} from "@mui/material";
import {
    createBoard,
    revealAllBears,
    didWin,
    flagAllHidden,
    flagCell,
    revealCellAndNeighbors, bearCount
} from "./boardUtilities.ts";
import {Board, Cell, GameDifficulty, GameState} from "./board.ts";
import RemainingBears from "./components/RemainingBears.tsx";
import GameStateIcon from "./components/GameStateIcon.tsx";
import LobbyModal from "./components/modals/LobbyModal.tsx";
import CellBox from "./components/CellBox.tsx";
import {TimeContext} from "./providers/TimeContext.tsx";
import {BoardContext} from "./providers/BoardContext.tsx";
import {GameStateContext} from "./providers/GameStateContext.tsx";
import './App.css'

export default function App() {

    const timeContext = useContext(TimeContext)
    if (!timeContext) {
        throw new Error("TimeContext used outside TimeProvider")
    }
    const {seconds, startTime, stopTime, resetTime} = timeContext

    const boardContext = useContext(BoardContext)
    if (!boardContext) {
        throw new Error("BoardContext used outside BoardProvider")
    }
    const {board, setBoard} = boardContext

    const gameStateContext = useContext(GameStateContext)
    if (!gameStateContext) {
        throw new Error("GameStateContext used outside GameStateProvider")
    }
    const {gameState, setGameState, pauseGame, setScore} = gameStateContext


    useEffect(() => {
        if (gameState === GameState.playing) {
            startTime()
        } else {
            stopTime()
        }
    }, [gameState, startTime, stopTime])

    const newGame = (difficulty: GameDifficulty) => {
        const newBoard = createBoard(difficulty)
        setGameState(GameState.playing)
        setBoard(newBoard)
        resetTime()
    }

    const onGameStateIconClick = () => {
        pauseGame()
    }

    const gameOver = () => {
        // reveal all cells
        const newBoard = revealAllBears(board)
        setBoard(newBoard)
        // set game state to lost
        setGameState(GameState.lost)
    }

    const winGame = (_board: Board) => {
        // calculate and set the score
        const numBears = bearCount(_board)
        const score = Math.floor(numBears / seconds * 1000)
        const newBoard = flagAllHidden(_board)
        setScore(score)
        setBoard(newBoard)
        setGameState(GameState.won)
    }

    const onCellClick = (cell: Cell) => {
        if (cell.isFlagged || cell.isRevealed || gameState !== GameState.playing) return
        if (cell.isBear) {
            gameOver()
            return
        }
        const newBoard = revealCellAndNeighbors(board, cell)
        setBoard(newBoard)
        if (didWin(newBoard)) {
            winGame(newBoard)
        }
    }


    const onCellRightClick = (e: SyntheticEvent, cell: Cell) => {
        e.preventDefault()
        if (cell.isRevealed || gameState !== GameState.playing) return
        const newBoard = flagCell(board, cell)
        setBoard(newBoard)
    }

    return (
        <>
            <Stack spacing={2}>
                <Stack direction='row' justifyContent='space-between'>
                    <Box><RemainingBears board={board}/></Box>
                    <Box onClick={onGameStateIconClick}><GameStateIcon gameState={gameState}/></Box>
                    <Box>{seconds}</Box>
                </Stack>
                <Stack spacing={0.5} sx={{background: '#592816', border: '4px solid #D9C9BA'}} padding={0.5}
                       borderRadius={2}>
                    {board.cells.map((row: Cell[], r: number) => (
                        <Stack direction='row' spacing={0.5} key={`row-${r}`}>{
                            row.map((cell, c) => (
                                <CellBox onClick={onCellClick} onRightClick={onCellRightClick} cell={cell}
                                         key={`cell-${c}`}/>))
                        }</Stack>
                    ))}
                </Stack>
            </Stack>
            {gameState !== GameState.playing && <LobbyModal newGame={newGame}/>}
        </>
    )
}
import {Backdrop, Button, Paper, Stack, Typography} from "@mui/material";
import {GameDifficulty, GameState} from "../board.ts";
import {useContext, useMemo} from "react";
import {TimeContext} from "../providers/TimeContext.tsx";
import {BoardContext} from "../providers/BoardContext.tsx";
import {mineCount} from "../boardUtilities.ts";
import {useAnimate} from "motion/react";
import {GameStateContext} from "../providers/GameStateContext.tsx";

export default function LobbyModal({newGame}: {
    newGame: (difficulty: GameDifficulty) => void
}) {
    const timeContext = useContext(TimeContext)
    if (!timeContext) {
        throw new Error("timeContext used outside the TimeContext Provider")
    }
    const {seconds} = timeContext

    const boardContext = useContext(BoardContext)
    if (!boardContext) {
        throw new Error("BoardContext used outside BoardProvider")
    }
    const {board} = boardContext

    const gameStateContext = useContext(GameStateContext)
    if (!gameStateContext) {
        throw new Error("GameStateContext used outside GameStateProvider")
    }
    const {gameState, resumeGame} = gameStateContext

    const newEasyGame = () => newGame(GameDifficulty.easy)
    const newModerateGame = () => newGame(GameDifficulty.moderate)
    const newHardGame = () => newGame(GameDifficulty.hard)
    const newExpertGame = () => newGame(GameDifficulty.expert)

    const headerText = useMemo(() => {
        if (gameState === GameState.paused) return 'Paused'
        if (gameState === GameState.won) return 'You Win!'
        if (gameState === GameState.lost) return 'Game Over'
        return 'Mines!'
    }, [gameState])

    const subheaderText = useMemo(() => {
        if (gameState === GameState.won) return `You located ${mineCount(board)} mines in ${seconds} seconds.`
        return null
    }, [board, gameState, seconds])

    const [scope, animate] = useAnimate()
    const onMouseDown = () => {
        if (gameState === GameState.lobby) return
        animate(scope.current, {opacity: 0}, {duration: .25})
        resumeGame()
    }

    const onMouseUp = () => {
        animate(scope.current, {opacity: 1}, {duration: .5})
    }


    return (
        <Backdrop ref={scope} open={true} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            <Paper elevation={4}>
                <Stack spacing={1} padding={1}>
                    <Typography variant='h4'>{headerText}</Typography>
                    <Typography variant='subtitle1'>{subheaderText}</Typography>
                    <Button sx={{backgroundColor: '#D9C9BA', color: '#592816'}}
                            onClick={newEasyGame}>New
                        Easy Game</Button>
                    <Button sx={{backgroundColor: '#A68877', color: '#26130B'}}
                            onClick={newModerateGame}>New
                        Moderate Game</Button>
                    <Button sx={{backgroundColor: '#8C694A', color: '#26130B'}}
                            onClick={newHardGame}>New
                        Hard Game</Button>
                    <Button sx={{backgroundColor: '#592816', color: '#D9C9BA'}}
                            onClick={newExpertGame}>New
                        Expert Game</Button>
                </Stack>
            </Paper>
        </Backdrop>
    )
}
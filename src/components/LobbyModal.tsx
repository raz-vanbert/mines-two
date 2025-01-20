import {Backdrop, Button, Paper, Stack, Typography} from "@mui/material";
import {GameDifficulty, GameState} from "../board.ts";
import {MouseEvent, useContext, useMemo, useState} from "react";
import {TimeContext} from "../providers/TimeContext.tsx";
import {BoardContext} from "../providers/BoardContext.tsx";
import {bearCount} from "../boardUtilities.ts";
import {useAnimate} from "motion/react";
import {GameStateContext} from "../providers/GameStateContext.tsx";
import _ from 'lodash'

const HOW_TO_BLURB = "Kodiak Quest challenges you to navigate a virtual wilderness where " +
    "hidden bears lurk beneath the grid. Each square you reveal shows a number indicating how many " +
    "Kodiak bears occupy the surrounding spaces (including diagonals). Use these clues to determine " +
    "where the bears are hiding—then mark those squares (right click) to keep a safe distance. " +
    "Uncover all the empty spaces without stumbling onto a bear, and you’ll complete your quest unscathed!"

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

    const topText = useMemo(() => {
        if (gameState === GameState.lobby) return 'Welcome to'
        return ''
    }, [gameState])

    const headerText = useMemo(() => {
        if (gameState === GameState.paused) return 'Paused'
        if (gameState === GameState.won) return 'You Win!'
        if (gameState === GameState.lost) return 'Game Over'
        return 'Kodiak Quest'
    }, [gameState])

    const subheaderText = useMemo(() => {
        if (gameState === GameState.won) return `You located ${bearCount(board)} bears in ${seconds} seconds.`
        return null
    }, [board, gameState, seconds])

    const [scope, animate] = useAnimate()
    const onMouseDown = (e: MouseEvent) => {
        if (!_.isEqual(e.target, e.currentTarget)) return
        if (gameState === GameState.lobby) return
        animate(scope.current, {opacity: 0}, {duration: .25})
        resumeGame()
    }

    const onMouseUp = () => {
        animate(scope.current, {opacity: 1}, {duration: .5})
    }

    const [showHowTo, setShowHowTo] = useState(false)
    const onHowToClick = () => {
        setShowHowTo(true)
    }
    const hideHowTo = () => setShowHowTo(false)


    return (
        <Backdrop ref={scope} open={true} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>
            <Paper elevation={4} sx={{maxWidth: 380}}>
                <Stack spacing={1} padding={1}>
                    <Typography variant='h2'>🐻</Typography>
                    <Typography variant='button' sx={{marginTop: '0 !important'}}>{topText}</Typography>
                    <Typography variant='h4' sx={{marginTop: '0 !important'}}>{headerText}</Typography>
                    <Typography variant='subtitle1'>{subheaderText}</Typography>
                    {showHowTo ? <><Typography variant='body1'>{HOW_TO_BLURB}</Typography>
                            <Button sx={{backgroundColor: '#A68877', color: '#26130B'}}
                                    onClick={hideHowTo}>ok</Button>
                        </> :
                        <>
                            <Button variant="outlined" sx={{color: '#592816'}} onClick={onHowToClick}>How to
                                play</Button>
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
                        </>}
                </Stack>
            </Paper>
        </Backdrop>
    )
}
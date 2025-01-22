import {Backdrop, Button, Divider, Paper, Stack, TextField, Typography} from "@mui/material";
import {GameDifficulty, GameState} from "../../board.ts";
import {ChangeEvent, MouseEvent, useContext, useMemo, useState} from "react";
import {bearCount} from "../../boardUtilities.ts";
import {useAnimate} from "motion/react";
import {GameStateContext} from "../../providers/GameStateContext.tsx";
import _ from 'lodash'
import Leaderboard from "../leaderboard/Leaderboard.tsx";

const HOW_TO_BLURB = "Kodiak Quest challenges you to navigate a virtual wilderness where " +
    "hidden bears lurk beneath the grid. Each square you reveal shows a number indicating how many " +
    "Kodiak bears occupy the surrounding spaces (including diagonals). Use these clues to determine " +
    "where the bears are hiding—then mark those squares (right click) to keep a safe distance. " +
    "Uncover all the empty spaces without stumbling onto a bear, and you’ll complete your quest unscathed!"

export default function LobbyModal({newGame}: {
    newGame: (difficulty: GameDifficulty) => void
}) {
    const gameStateContext = useContext(GameStateContext)
    if (!gameStateContext) {
        throw new Error("GameStateContext used outside GameStateProvider")
    }
    const {board, gameState, setGameState, resumeGame, score, handleSubmitScore, seconds} = gameStateContext

    const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false)
    const showLeaderboard = () => {
        setIsLeaderboardVisible(true)
    }

    const hideLeaderboard = () => {
        setIsLeaderboardVisible(false)
    }

    const [showHowTo, setShowHowTo] = useState(false)
    const onHowToClick = () => {
        setShowHowTo(true)
    }
    const hideHowTo = () => setShowHowTo(false)

    const newEasyGame = () => newGame(GameDifficulty.easy)
    const newModerateGame = () => newGame(GameDifficulty.moderate)
    const newHardGame = () => newGame(GameDifficulty.hard)
    const newExpertGame = () => newGame(GameDifficulty.expert)

    const topText = useMemo(() => {
        if (showHowTo) return 'How to Play'
        if (isLeaderboardVisible) return 'Leaderboard'
        if (gameState === GameState.lobby) return 'Welcome to'
        return ''
    }, [gameState, showHowTo, isLeaderboardVisible])

    const headerText = useMemo(() => {
        if (showHowTo || isLeaderboardVisible) return ''
        if (gameState === GameState.paused) return 'Paused'
        if (gameState === GameState.won) return 'You Win!'
        if (gameState === GameState.lost) return 'Game Over'
        return 'Kodiak Quest'
    }, [gameState, showHowTo, isLeaderboardVisible])

    const subheaderText = useMemo(() => {
        if (gameState === GameState.won) return `You located ${bearCount(board)} bears in ${seconds} seconds.`
        return null
    }, [board, gameState, seconds])


    const [backdrop, animate] = useAnimate()
    const onMouseDown = (e: MouseEvent) => {
        if (!_.isEqual(e.target, e.currentTarget)) return
        if (gameState === GameState.lobby) return
        animate(backdrop.current, {opacity: 0}, {duration: .25})
        resumeGame()
    }

    const onMouseUp = () => {
        animate(backdrop.current, {opacity: 1}, {duration: .5})
    }

    const [playerName, setPlayerName] = useState('')
    const [playerNameError, setPlayerNameError] = useState(false)
    const onPlayerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPlayerName(e.target.value)
    }
    const onScoreSubmit = () => {
        if (playerName.length === 0) {
            setPlayerNameError(true)
            return
        }
        handleSubmitScore(playerName)
        setPlayerName('')
        setPlayerNameError(false)
        setGameState(GameState.lobby)
    }

    const onDismissScore = () => {
        setPlayerName('')
        setPlayerNameError(false)
        setGameState(GameState.lobby)
    }

    return (
        <Backdrop ref={backdrop} open={true} onMouseDown={onMouseDown} onMouseUp={onMouseUp}>

            <Paper elevation={4} sx={{maxWidth: 380, minWidth: 280, minHeight: 400}}>
                <Stack spacing={1} padding={1}>
                    <Typography variant='h2'>🐻</Typography>
                    <Typography variant='button' sx={{marginTop: '0 !important'}}>{topText}</Typography>
                    <Typography variant='h4' sx={{marginTop: '0 !important'}}>{headerText}</Typography>
                    <Typography variant='subtitle1'>{subheaderText}</Typography>
                    {gameState === GameState.won ?
                        <Stack>
                            <Typography variant='h6'>Your Score: {score}</Typography>
                            <Typography variant='body1'>Wanna add it to the leaderboard?</Typography>
                            <TextField
                                sx={{marginTop: 2}}
                                label="Name"
                                value={playerName}
                                error={playerNameError}
                                onChange={onPlayerNameChange}
                            />
                            <Button sx={{backgroundColor: '#8C694A', color: '#26130B', marginTop: 2}}
                                    onClick={onScoreSubmit}>
                                Submit score
                            </Button>
                            <Button sx={{backgroundColor: '#A68877', color: '#26130B', marginTop: 2}}
                                    onClick={onDismissScore}>
                                No Thanks
                            </Button>
                        </Stack>
                        : <>
                            {isLeaderboardVisible ?
                                <>
                                    <Leaderboard/>
                                    <Button sx={{backgroundColor: '#A68877', color: '#26130B'}}
                                            onClick={hideLeaderboard}>ok</Button>
                                </>
                                : showHowTo ?
                                    <>
                                        <Typography variant='body1'>{HOW_TO_BLURB}</Typography>
                                        <Button sx={{backgroundColor: '#A68877', color: '#26130B'}}
                                                onClick={hideHowTo}>ok</Button>
                                    </>
                                    : <>
                                        <Button sx={{backgroundColor: '#8C694A', color: '#26130B'}}
                                                onClick={showLeaderboard}>
                                            Leaderboard
                                        </Button>
                                        <Button variant="outlined" sx={{color: '#592816'}} onClick={onHowToClick}>
                                            How to play
                                        </Button>
                                        <Divider/>
                                        <Button sx={{backgroundColor: '#D9C9BA', color: '#592816'}}
                                                onClick={newEasyGame}>
                                            New Easy Game
                                        </Button>
                                        <Button sx={{backgroundColor: '#A68877', color: '#26130B'}}
                                                onClick={newModerateGame}>
                                            New Moderate Game
                                        </Button>
                                        <Button sx={{backgroundColor: '#8C694A', color: '#26130B'}}
                                                onClick={newHardGame}>
                                            New Hard Game
                                        </Button>
                                        <Button sx={{backgroundColor: '#592816', color: '#D9C9BA'}}
                                                onClick={newExpertGame}>
                                            New Expert Game
                                        </Button>
                                    </>}
                        </>}
                </Stack>
            </Paper>
        </Backdrop>
    )
}
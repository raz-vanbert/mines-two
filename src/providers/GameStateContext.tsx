import {createContext, Dispatch, ReactNode, SetStateAction, useState,} from "react";
import {GameDifficulty, GameState} from "../board.ts";
import {submitScore} from "../services/awsService"

interface GameStateContextValue {
    gameState: GameState
    setGameState: Dispatch<SetStateAction<GameState>>
    gameDifficulty: GameDifficulty
    setGameDifficulty: Dispatch<SetStateAction<GameDifficulty>>
    pauseGame: () => void
    resumeGame: () => void
    score: number
    setScore: Dispatch<SetStateAction<number>>
    handleSubmitScore: (playerName: string) => void
}

export const GameStateContext = createContext<GameStateContextValue | null>(null)

interface GameStateProviderProps {
    children: ReactNode
}

export function GameStateProvider({children}: GameStateProviderProps) {
    const [gameState, setGameState] = useState(GameState.lobby)
    const [gameDifficulty, setGameDifficulty] = useState(GameDifficulty.easy)
    const [score, setScore] = useState<number>(0)

    const pauseGame = () => {
        if (gameState === GameState.playing) {
            setGameState(GameState.paused)
        }
    }

    const resumeGame = () => {
        if (gameState === GameState.paused) {
            setGameState(GameState.playing)
        }
    }

    const handleSubmitScore = async (playerName: string) => {
        try {
            await submitScore(playerName, score)
            console.log('Score submitted!')
        } catch (error) {
            console.error('Error submitting score:', error)
        }
    }

    const value: GameStateContextValue = {
        gameState,
        setGameState,
        pauseGame,
        resumeGame,
        gameDifficulty,
        setGameDifficulty,
        score,
        setScore,
        handleSubmitScore
    }

    return (
        <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
    )
}
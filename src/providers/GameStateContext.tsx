import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState,} from "react";
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
    // time
    seconds: number;
    setSeconds: Dispatch<SetStateAction<number>>;
    startTime: () => void;
    stopTime: () => void;
    resetTime: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const GameStateContext = createContext<GameStateContextValue | null>(null)

interface GameStateProviderProps {
    children: ReactNode
}

export function GameStateProvider({children}: GameStateProviderProps) {
    const [gameState, setGameState] = useState(GameState.lobby)
    const [gameDifficulty, setGameDifficulty] = useState(GameDifficulty.easy)
    const [score, setScore] = useState<number>(0)
    // time keeping
    const [seconds, setSeconds] = useState<number>(0)
    const intervalRef = useRef<number | null>(null)

    const startTime = () => {
        if (intervalRef.current !== null) return // already running
        intervalRef.current = window.setInterval(() => {
            setSeconds((prev) => prev + 1)
        }, 1000)
    };

    const stopTime = () => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    };

    const resetTime = () => {
        stopTime()
        setSeconds(0)
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current)
            }
        }
    }, [])
    // end time keeping

    const pauseGame = () => {
        if (gameState === GameState.playing) {
            setGameState(GameState.paused)
            stopTime()
        }
    }

    const resumeGame = () => {
        if (gameState === GameState.paused) {
            setGameState(GameState.playing)
            startTime()
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
        handleSubmitScore,
        seconds,
        setSeconds,
        startTime,
        stopTime,
        resetTime,
    }

    return (
        <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
    )
}
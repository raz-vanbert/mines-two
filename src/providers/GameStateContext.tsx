import {createContext, Dispatch, ReactNode, SetStateAction, useState,} from "react";
import {GameState} from "../board.ts";

interface GameStateContextValue {
    gameState: GameState
    setGameState: Dispatch<SetStateAction<GameState>>
    pauseGame: () => void
    resumeGame: () => void
}

export const GameStateContext = createContext<GameStateContextValue | null>(null)

interface GameStateProviderProps {
    children: ReactNode
}

export function GameStateProvider({children}: GameStateProviderProps) {
    const [gameState, setGameState] = useState(GameState.lobby)

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

    const value: GameStateContextValue = {
        gameState,
        setGameState,
        pauseGame,
        resumeGame
    }

    return (
        <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
    )
}
import {GameState} from "../board.ts";

export default function GameStateIcon({gameState}: { gameState: GameState }) {
    if (gameState === GameState.playing) return <>😬</>
    if (gameState === GameState.lost) return <>😵</>
    if (gameState === GameState.won) return <>🤩</>
    return <>😴</>
}
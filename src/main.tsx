import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {TimeProvider} from "./providers/TimeContext.tsx";
import {BoardProvider} from "./providers/BoardContext.tsx";
import {GameStateProvider} from "./providers/GameStateContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TimeProvider>
            <GameStateProvider>
                <BoardProvider>
                    <App/>
                </BoardProvider>
            </GameStateProvider>
        </TimeProvider>
    </StrictMode>,
)

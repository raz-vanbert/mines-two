import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BoardProvider} from "./providers/BoardContext.tsx";
import {GameStateProvider} from "./providers/GameStateContext.tsx";
import {Analytics} from "@vercel/analytics/react"

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GameStateProvider>
            <BoardProvider>
                <App/>
                <Analytics/>
            </BoardProvider>
        </GameStateProvider>
    </StrictMode>,
)

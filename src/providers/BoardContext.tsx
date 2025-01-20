import {
    createContext,
    useState,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import {Board, BoardSizes} from "../board.ts";
import {createEmptyBoard} from "../boardUtilities.ts";

interface BoardContextValue {
    board: Board
    setBoard: Dispatch<SetStateAction<Board>>
}

export const BoardContext = createContext<BoardContextValue | null>(null)

interface BoardProviderProps {
    children: ReactNode
}

export function BoardProvider({children}: BoardProviderProps) {
    const [board, setBoard] = useState(createEmptyBoard(BoardSizes.medium))


    const value: BoardContextValue = {
        board,
        setBoard
    }

    return (
        <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
    )
}
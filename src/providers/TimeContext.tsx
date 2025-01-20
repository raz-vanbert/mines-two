import {
    createContext,
    useState,
    useRef,
    useEffect,
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";

interface TimeContextValue {
    seconds: number;
    setSeconds: Dispatch<SetStateAction<number>>;
    startTime: () => void;
    stopTime: () => void;
    resetTime: () => void;
}

export const TimeContext = createContext<TimeContextValue | null>(null);

interface TimeProviderProps {
    children: ReactNode;
}

export function TimeProvider({children}: TimeProviderProps) {
    const [seconds, setSeconds] = useState<number>(0);
    const intervalRef = useRef<number | null>(null);

    const startTime = () => {
        if (intervalRef.current !== null) return; // already running
        intervalRef.current = window.setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
    };

    const stopTime = () => {
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTime = () => {
        stopTime()
        setSeconds(0)
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
            }
        };
    }, []);

    const value: TimeContextValue = {
        seconds,
        setSeconds,
        startTime,
        stopTime,
        resetTime,
    };

    return (
        <TimeContext.Provider value={value}>
            {children}
        </TimeContext.Provider>
    );
}
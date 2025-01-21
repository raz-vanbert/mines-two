import {useEffect, useState} from 'react';
import {getLeaderboard} from './getLeaderboard'; // Import your DynamoDB function

interface LeaderboardEntry {
    PlayerName: string;
    Score: number;
}

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getLeaderboard();
                setLeaderboard(data as LeaderboardEntry[]);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }

        fetchData().then(() => null);
    }, []);

    return (
        <div>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard.map((entry, index) => (
                    <li key={index}>
                        {entry.PlayerName}: {entry.Score}
                    </li>
                ))}
            </ul>
        </div>
    );
}
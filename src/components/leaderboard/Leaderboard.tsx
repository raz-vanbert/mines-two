import {useEffect, useState} from 'react';
import {getLeaderboard} from "../../services/awsService.ts";
import {Divider, List, ListItem, ListItemText} from "@mui/material";
import _ from "lodash";

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
                // sort by score
                const sortedData = _.sortBy(data, (entry) => -entry.Score)
                setLeaderboard(sortedData as LeaderboardEntry[]);
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
            }
        }

        fetchData().then(() => null);
    }, []);

    return (

        <List dense>
            {leaderboard.map((entry, index) => (
                <ListItem key={index} secondaryAction={entry.Score}>
                    <ListItemText>
                        {entry.PlayerName}
                    </ListItemText>
                    <Divider/>
                </ListItem>
            ))}
        </List>
    );
}
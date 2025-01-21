import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {PutCommand, ScanCommand} from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
});

// Function to submit a score
export async function submitScore(playerName: string, score: number) {
    if (!playerName || !score) {
        throw new Error("Player name and score are required.");
    }

    const params = {
        TableName: "Leaderboaed", // Replace with your DynamoDB table name
        Item: {
            PlayerName: playerName, // Partition Key
            Score: score, // Sort Key (if applicable)
            Timestamp: Date.now(), // Optional additional field
        },
    };

    try {
        const command = new PutCommand(params);
        await client.send(command);
        console.log("Score submitted successfully!");
    } catch (error) {
        console.error("Error submitting score:", error);
        throw error;
    }
}

export async function getLeaderboard() {
    const params = {
        TableName: 'Leaderboaed',
        Limit: 10,
    };

    try {
        const command = new ScanCommand(params);
        const data = await client.send(command);
        return data.Items;
    } catch (error) {
        console.error("Error getting scores:", error);
        throw error;
    }
}
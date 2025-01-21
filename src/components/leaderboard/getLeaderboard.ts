import AWS from 'aws-sdk';

// Configure AWS
AWS.config.update({
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    region: import.meta.env.VITE_AWS_REGION,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getLeaderboard() {
    const params = {
        TableName: 'Leaderboard',
        Limit: 10,
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return data.Items;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
}
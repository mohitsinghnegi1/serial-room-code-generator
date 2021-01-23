import * as AWS from "aws-sdk";
import { dbConfigGameRoomMapper } from "../config/config";

let dbConfig: AWS.DynamoDB.ClientConfiguration = dbConfigGameRoomMapper;
let dynamoDB = new AWS.DynamoDB.DocumentClient(dbConfig);

export const setGameRoomMapping = async (gameMode: string, gameRoomId: string, serverAddress: string): Promise<boolean> => {

    try {
        let params = {
            TableName: 'GameRoomMapper',
            Item: {
                gameMode: gameMode,
                gameRoomId: gameRoomId,
                serverAddress: serverAddress
            }
        };

        await dynamoDB.put(params).promise();
        return true;
    } catch (e) {
        console.log('Error while setting game room mapping');
        return false;
    }
};

export const getGameRoomAddress = async (gameMode: string, gameRoomId: string): Promise<string> => {
    try {

        var params = {
            TableName: 'GameRoomMapper',
            KeyConditionExpression: 'gameMode = :gameMode and gameRoomId = :gameRoomId',
            ExpressionAttributeValues: {
                ':gameMode': gameMode,
                ':gameRoomId': gameRoomId
            }
        };

        const responseObj = await dynamoDB.query(params).promise();
        console.log("response from getGameRoomAddress :", responseObj);

        if (responseObj && responseObj.Items.length == 1) {
            return responseObj.Items[0].serverAddress;
        }
        else if (responseObj && responseObj.Items.length == 0) {
            console.log('Error: Game %s with game room id %s does not exist', gameMode, gameRoomId);
        }
        else {
            console.log('Error: More then one entry for same game room & game room id exist');
        }
        return null;
    } catch (e) {
        console.log('error:', e);
        return null;
    }
};


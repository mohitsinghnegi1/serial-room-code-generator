import * as AWS from "aws-sdk";
import { PromiseResult } from "aws-sdk/lib/request";
import { dbConfigurationParameters } from "../config/config";
import { SerialCodeGenerator } from './serial_codes_generator';

const serialCodeGeneratorObj = new SerialCodeGenerator();

let dbConfig: AWS.DynamoDB.ClientConfiguration = dbConfigurationParameters;
let dynamoDB = new AWS.DynamoDB.DocumentClient(dbConfig);

function updateNextCodeInDB(gameMode: string, nextCode: string): Promise<PromiseResult<AWS.DynamoDB.DocumentClient.TransactWriteItemsOutput, AWS.AWSError>> {
    var params = {
        TransactItems: [{
            Update: {
                TableName: 'serialCodeGenerator',
                Key: { gameMode: gameMode },
                UpdateExpression: 'set #code = :nextCode',
                ExpressionAttributeNames: { '#code': 'code' },
                ExpressionAttributeValues: {
                    ':nextCode': nextCode,
                }
            }
        }]
    };

    return dynamoDB.transactWrite(params).promise();
}

function getPreviousCodeFromDB(gameMode: string): Promise<PromiseResult<AWS.DynamoDB.DocumentClient.TransactGetItemsOutput, AWS.AWSError>> {
    var params = {
        TransactItems: [{
            Get: {
                TableName: 'serialCodeGenerator',
                Key: { gameMode: gameMode },
                // ExpressionAttributeNames: { '#code': 'code' },
                // ProjectionExpression: '#code'
            }
        }]
    };

    return dynamoDB.transactGet(params).promise();
}

export async function getGameRoomId(gameMode): Promise<string> {
    try {
        const getPrevCodeResponseObj = await getPreviousCodeFromDB(gameMode);
        console.log('Response : ', getPrevCodeResponseObj.Responses);
        if (getPrevCodeResponseObj && getPrevCodeResponseObj.Responses && getPrevCodeResponseObj.Responses.length > 0) {
            const prevCode = getPrevCodeResponseObj.Responses[0].Item.code;
            let nextCode = serialCodeGeneratorObj.getNextUniqueSerialCode(prevCode);
            await updateNextCodeInDB(gameMode, nextCode);
            return nextCode;
        } else {
            console.log('error while updating code');
            return null;
        }
    } catch (e) {
        console.log('error:', e);
        return null;
    }
}


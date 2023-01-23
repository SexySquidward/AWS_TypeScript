import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid'
import { getEventBody } from '../Shared/utils';
const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    };

  try {
    const requestBody = getEventBody(event);
    const SpaceId = event.queryStringParameters?.[PRIMARY_KEY];
    
    if(requestBody && SpaceId){
        const requestBodyKey = Object.keys(requestBody)[0];
        const requestBodyValue = requestBody[requestBodyKey];

        const updateResult = await dbClient.update({
            TableName: TABLE_NAME,
            Key:{
                [PRIMARY_KEY]: SpaceId
            },
            UpdateExpression: 'set #zzzNew = :new',
            ExpressionAttributeValues:{
                ':new': requestBodyValue
            },
            ExpressionAttributeNames:{
                '#zzzNew': requestBodyKey
            },
            ReturnValues: 'UPDATED_NEW'
        }).promise();

        result.body = JSON.stringify(updateResult);
    } 
  } catch (error) {
    let errorMessage = "Failed to do something exceptional";
    if (error instanceof Error) {
        errorMessage = error.message;
      }
    result.body = errorMessage
  }
    return result;

}


export { handler }
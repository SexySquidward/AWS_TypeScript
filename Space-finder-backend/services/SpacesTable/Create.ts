import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { generateRandomId, getEventBody } from '../Shared/utils';
import { MissingFieldError, validateAsSpaceEntry } from '../Shared/Inputvalidator';
const TABLE_NAME = process.env.TABLE_NAME

const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    };

    

    try {
        const item = getEventBody(event);
        item.SpaceId = generateRandomId();
        validateAsSpaceEntry(item);
        await dbClient.put({
            TableName: TABLE_NAME!,
            Item: item
        }).promise();
        result.body = JSON.stringify(`Created item with id: ${item.SpaceId}`);
    } catch (error) {
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
          }

        if(error instanceof MissingFieldError){
            result.statusCode = 403;
        }else{
            result.statusCode = 500;
        }
        
        result.body = errorMessage;
    }
    
    return result;

}


export { handler }
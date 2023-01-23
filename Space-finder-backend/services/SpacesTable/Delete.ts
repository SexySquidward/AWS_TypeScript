import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 } from 'uuid'

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'Hello from DYnamoDb'
    };
    try{
    const SpaceId = event.queryStringParameters?.[PRIMARY_KEY];
    
    if(SpaceId){
        const deleteResult = await dbClient.delete({
            TableName: TABLE_NAME,
            Key:{
                [PRIMARY_KEY]: SpaceId
            }
        }).promise();
        result.body = JSON.stringify(deleteResult);
    }
    
    }
    catch (error){
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
            errorMessage = error.message;
          }
        result.body = errorMessage
    }
    return result;
}


export { handler }
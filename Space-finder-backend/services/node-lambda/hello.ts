import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3Client = new S3();
async function handler (event: any, context: any) {
    
if(isAuthorized(event)){
    return{
        statusCode: 200,
        body: JSON.stringify('You are Authorized!')
    }
}else{
    return{
        statusCode: 401 ,
        body: JSON.stringify('You are not Authorized')
    }
}

    
}

function isAuthorized(event: APIGatewayProxyEvent){
    const groups = event.requestContext.authorizer?.claims['cognito:groups'];
    if(groups){
        return (groups as string).includes('Admin')
    }else{
        return false 
    }
}

export {handler}
import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {join} from 'path';
import {AuthorizationType, LambdaIntegration, MethodOptions, RestApi} from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {AuthorizerWrapper} from './Auth/AuthorizerWrapper'
export class SpaceStack extends Stack{

    private api = new RestApi(this, 'SpaceApi');
    private authorizer: AuthorizerWrapper;
    // private spacesTable = new GenericTable(
    //     'SpacesTable',
    //     'SpaceId',
    //     this
    // )

    private spacesTable = new GenericTable(this,{
        tableName: 'SpacesTable',
        primaryKey: 'SpaceId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        deleteLambdaPath: 'Delete',
        secondaryIndexes: ['location']
    })


    constructor(scope: Construct, id: string ,props: StackProps){
        super(scope,id,props)

        this.authorizer = new AuthorizerWrapper(this,this.api);



      
        const helloLambdaNodeJs = new NodejsFunction(this, 'helloLambdaNodeJs', {
            entry: (join(__dirname, '..', 'services', 'node-lambda', 'hello.ts')),
            handler: 'handler'

        });

        const s3ListPolicy = new PolicyStatement();
        s3ListPolicy.addActions('s3:ListAllMyBuckets');
        s3ListPolicy.addResources('*');
        helloLambdaNodeJs.addToRolePolicy(s3ListPolicy);
        //Hello API Lambda Intergration
        const optionsWithAuthorizer: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: this.authorizer.authorizer.authorizerId
            }
        }


        const helloLambdaIntergration = new LambdaIntegration(helloLambdaNodeJs);
        const helloLambdaResource = this.api.root.addResource('hello')
        helloLambdaResource.addMethod('GET', helloLambdaIntergration, optionsWithAuthorizer);


        //spaces API Intergrations

        const spaceResources = this.api.root.addResource('spaces');
        spaceResources.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResources.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResources.addMethod('PUT', this.spacesTable.updateLambdaIntegration);
        spaceResources.addMethod('DELETE', this.spacesTable.deleteLambdaIntegration);



    }
}
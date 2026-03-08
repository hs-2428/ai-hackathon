const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const apigateway = require('aws-cdk-lib/aws-apigateway');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const s3 = require('aws-cdk-lib/aws-s3');
const iam = require('aws-cdk-lib/aws-iam');

class TribalAppStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // S3 Buckets
    const audioBucket = new s3.Bucket(this, 'AudioBucket', {
      bucketName: 'tribal-app-audio',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      lifecycleRules: [{
        expiration: cdk.Duration.days(30)
      }]
    });

    const knowledgeBucket = new s3.Bucket(this, 'KnowledgeBucket', {
      bucketName: 'tribal-app-knowledge',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    const newsBucket = new s3.Bucket(this, 'NewsBucket', {
      bucketName: 'tribal-app-news',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED
    });

    // DynamoDB Tables
    const sessionsTable = new dynamodb.Table(this, 'SessionsTable', {
      tableName: 'tribal-app-sessions',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl'
    });

    const interactionsTable = new dynamodb.Table(this, 'InteractionsTable', {
      tableName: 'tribal-app-interactions',
      partitionKey: { name: 'interactionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl'
    });

    const newsTable = new dynamodb.Table(this, 'NewsTable', {
      tableName: 'tribal-app-news',
      partitionKey: { name: 'newsId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl'
    });

    newsTable.addGlobalSecondaryIndex({
      indexName: 'language-timestamp-index',
      partitionKey: { name: 'language', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER }
    });

    // IAM Role for Lambda with Bedrock access
    const lambdaRole = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
      ]
    });

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:InvokeModel',
        'bedrock:InvokeModelWithResponseStream'
      ],
      resources: ['*']
    }));

    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'polly:SynthesizeSpeech',
        'transcribe:StartTranscriptionJob',
        'transcribe:GetTranscriptionJob'
      ],
      resources: ['*']
    }));

    // Lambda Functions
    const culturalAssistantFn = new lambda.Function(this, 'CulturalAssistant', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend/lambda/cultural-assistant'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      role: lambdaRole,
      environment: {
        KNOWLEDGE_BUCKET: knowledgeBucket.bucketName,
        SESSIONS_TABLE: sessionsTable.tableName,
        INTERACTIONS_TABLE: interactionsTable.tableName
      }
    });

    const textToSpeechFn = new lambda.Function(this, 'TextToSpeech', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend/lambda/text-to-speech'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      role: lambdaRole,
      environment: {
        AUDIO_BUCKET: audioBucket.bucketName
      }
    });

    const voiceProcessorFn = new lambda.Function(this, 'VoiceProcessor', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend/lambda/voice-processor'),
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      role: lambdaRole,
      environment: {
        AUDIO_BUCKET: audioBucket.bucketName,
        SESSIONS_TABLE: sessionsTable.tableName
      }
    });

    const languageDetectorFn = new lambda.Function(this, 'LanguageDetector', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend/lambda/language-detector'),
      timeout: cdk.Duration.seconds(15),
      memorySize: 256,
      role: lambdaRole
    });

    const newsAggregatorFn = new lambda.Function(this, 'NewsAggregator', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../backend/lambda/news-aggregator'),
      timeout: cdk.Duration.seconds(60),
      memorySize: 512,
      role: lambdaRole,
      environment: {
        NEWS_BUCKET: newsBucket.bucketName,
        NEWS_TABLE: newsTable.tableName
      }
    });

    // Grant permissions
    audioBucket.grantReadWrite(culturalAssistantFn);
    audioBucket.grantReadWrite(textToSpeechFn);
    audioBucket.grantReadWrite(voiceProcessorFn);
    knowledgeBucket.grantRead(culturalAssistantFn);
    newsBucket.grantRead(newsAggregatorFn);
    
    sessionsTable.grantReadWriteData(culturalAssistantFn);
    sessionsTable.grantReadWriteData(voiceProcessorFn);
    interactionsTable.grantReadWriteData(culturalAssistantFn);
    newsTable.grantReadWriteData(newsAggregatorFn);

    // API Gateway
    const api = new apigateway.RestApi(this, 'TribalAppAPI', {
      restApiName: 'Tribal Accessibility API',
      description: 'API for tribal language accessibility platform',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    // API Endpoints
    const culturalAssistant = api.root.addResource('cultural-assistant');
    culturalAssistant.addMethod('POST', new apigateway.LambdaIntegration(culturalAssistantFn));

    const tts = api.root.addResource('text-to-speech');
    tts.addMethod('POST', new apigateway.LambdaIntegration(textToSpeechFn));

    const voiceProcessor = api.root.addResource('voice-processor');
    voiceProcessor.addMethod('POST', new apigateway.LambdaIntegration(voiceProcessorFn));

    const languageDetector = api.root.addResource('detect-language');
    languageDetector.addMethod('POST', new apigateway.LambdaIntegration(languageDetectorFn));

    const news = api.root.addResource('news');
    news.addMethod('POST', new apigateway.LambdaIntegration(newsAggregatorFn));
    news.addMethod('GET', new apigateway.LambdaIntegration(newsAggregatorFn));

    // Outputs
    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: api.url,
      description: 'API Gateway endpoint URL'
    });

    new cdk.CfnOutput(this, 'AudioBucketName', {
      value: audioBucket.bucketName
    });

    new cdk.CfnOutput(this, 'KnowledgeBucketName', {
      value: knowledgeBucket.bucketName
    });
  }
}

module.exports = { TribalAppStack };

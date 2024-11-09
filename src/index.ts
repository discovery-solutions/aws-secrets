import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

interface SecretsOptions {
  logger?: any;
  region?: string;
  credentials?: Credentials;
}

export class Secrets {
  private static instance: Secrets;
  private secretsCache: { [key: string]: string | undefined } = {};
  private initialized = false;
  private client: SecretsManagerClient;
  private secretId: string;
  private logger: any;

  private constructor(
    secretId: string,
    { logger, credentials, region }: SecretsOptions,
  ) {
    if (Secrets.instance)
      return Secrets.instance;
    
    this.logger = logger || console;
    this.secretId = secretId;
    this.setCredentials({ region, credentials });
    Secrets.instance = this;
  }

  public static getInstance(secretId: string, options: SecretsOptions): Secrets {
    if (!Secrets.instance) {
      Secrets.instance = new Secrets(secretId, options);
    }
    return Secrets.instance;
  }

  public setCredentials({ region, credentials }: { credentials: Credentials, region: string }): void {
    this.client = new SecretsManagerClient({
      region: region || process.env.AWS_REGION,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
  }

  public async sync(): Promise<void> {
    if (this.initialized) return;

    try {
      const response = await this.client.send(
        new GetSecretValueCommand({
          SecretId: this.secretId,
          VersionStage: 'AWSCURRENT',
        })
      );
      this.secretsCache = JSON.parse(response.SecretString || '{}');
      this.initialized = true;
    } catch (error) {
      this.logger.error('Failed to retrieve secrets', error);
      throw error;
    }
  }

  public get(key: string): any {
    if (!this.initialized)
      throw new Error("Secrets have not been initialized. Call Secrets.sync() first.");
      
    return this.secretsCache[key] || process.env[key];
  }
}

export default Secrets;

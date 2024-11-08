import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';

interface Credentials {
  accessKeyId: string;
  secretAccessKey: string;
}

export class Secrets {
  private static instance: Secrets;
  private secretsCache: { [key: string]: string | undefined } = {};
  private initialized = false;
  private client: SecretsManagerClient;
  private secretId: string;

  private constructor(secretId: string) {
    if (Secrets.instance)
      return Secrets.instance;
    
    this.secretId = secretId;
    this.client = new SecretsManagerClient({ region: 'us-east-1' });
    Secrets.instance = this;
  }

  public static getInstance(secretId: string): Secrets {
    if (!Secrets.instance) {
      Secrets.instance = new Secrets(secretId);
    }
    return Secrets.instance;
  }

  public setCredentials(credentials: Credentials): void {
    this.client = new SecretsManagerClient({
      region: 'us-east-1',
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
      console.error('Failed to retrieve secrets', error);
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

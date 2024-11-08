"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Secrets = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
class Secrets {
    constructor(secretId) {
        this.secretsCache = {};
        this.initialized = false;
        if (Secrets.instance)
            return Secrets.instance;
        this.secretId = secretId;
        this.client = new client_secrets_manager_1.SecretsManagerClient({ region: 'us-east-1' });
        Secrets.instance = this;
    }
    static getInstance(secretId) {
        if (!Secrets.instance) {
            Secrets.instance = new Secrets(secretId);
        }
        return Secrets.instance;
    }
    setCredentials(credentials) {
        this.client = new client_secrets_manager_1.SecretsManagerClient({
            region: 'us-east-1',
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
            },
        });
    }
    async sync() {
        if (this.initialized)
            return;
        try {
            const response = await this.client.send(new client_secrets_manager_1.GetSecretValueCommand({
                SecretId: this.secretId,
                VersionStage: 'AWSCURRENT',
            }));
            this.secretsCache = JSON.parse(response.SecretString || '{}');
            this.initialized = true;
        }
        catch (error) {
            console.error('Failed to retrieve secrets', error);
            throw error;
        }
    }
    get(key) {
        if (!this.initialized)
            throw new Error("Secrets have not been initialized. Call Secrets.sync() first.");
        return this.secretsCache[key] || process.env[key];
    }
}
exports.Secrets = Secrets;
exports.default = Secrets;

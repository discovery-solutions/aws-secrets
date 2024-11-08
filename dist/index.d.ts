interface Credentials {
    accessKeyId: string;
    secretAccessKey: string;
}
export declare class Secrets {
    private static instance;
    private secretsCache;
    private initialized;
    private client;
    private secretId;
    private constructor();
    static getInstance(secretId: string): Secrets;
    setCredentials(credentials: Credentials): void;
    sync(): Promise<void>;
    get(key: string): any;
}
export default Secrets;

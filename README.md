# @discovery-solutions/aws-secrets

A library for managing AWS Secrets Manager secrets with caching capabilities.

## Features

- Singleton pattern for managing secrets
- Support for caching secrets to reduce AWS requests
- Optional credentials configuration per secret
- Supports multiple secrets with distinct `secretId`s

## Installation

Install via npm:

```bash
npm install github:discovery-solutions/aws-secrets
```

or via yarn:

```bash
yarn add github:discovery-solutions/aws-secrets
```

## Usage

### Basic Example

```typescript
import Secrets from '@discovery-solutions/aws-secrets';

async function main() {
  // Initialize with the secret ID
  const secrets = new Secrets('my-secret-id');

  // Sync secrets (retrieves and caches the secrets from AWS Secrets Manager)
  await secrets.sync();

  // Access secrets by key
  const apiKey = secrets.get('API_KEY');
  console.log('API Key:', apiKey);
}

main();
```

### Using Custom AWS Credentials

You can pass custom AWS credentials during initialization:

```typescript
import Secrets from '@discovery-solutions/aws-secrets';

const secrets = new Secrets('my-secret-id', {
  credentials: {
    accessKeyId: 'your-access-key-id',
    secretAccessKey: 'your-secret-access-key'
  }
});

async function setup() {
  await secrets.sync();
  console.log('Database Password:', secrets.get('DB_PASSWORD'));
}

setup();
```

### Setting Credentials After Initialization

Alternatively, set credentials at any time using `setCredentials`:

```typescript
secrets.setCredentials({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key'
});
```

## API

### `Secrets` Class

- **Constructor** `new Secrets(secretId: string, options?: SecretsOptions)`

  - `secretId` (string): ID of the AWS secret.
  - `options` (optional): Configuration options.
    - `credentials` (optional): AWS credentials object with `accessKeyId` and `secretAccessKey`.

- **`sync()`**: `Promise<void>`

  Fetches and caches secrets from AWS Secrets Manager. Should be called before accessing secrets.

- **`setCredentials(credentials: Credentials): void`**

  Updates the AWS credentials after initialization.

- **`get(key: string): any`**

  Retrieves a cached secret by key. If the key is not found in the cache, falls back to environment variables.

## Error Handling

If `sync()` is not called before `get()`, an error will be thrown:
```typescript
Error: Secrets have not been initialized. Call sync() first.
```

## Development

### Running Tests

This library uses Jest for testing. Run tests with:

```bash
npm test
```

### Building the Project

To compile TypeScript to JavaScript:

```bash
npm run build
```

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
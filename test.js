const { Secrets } = require('./dist');

const secrets = new Secrets('test', {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

secrets.sync().then(console.log).catch(console.log);
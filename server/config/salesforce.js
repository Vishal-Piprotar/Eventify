import jsforce from 'jsforce';
import 'dotenv/config';

const conn = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL,
});

const connect = async () => {
  try {
    const userInfo = await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD);
    console.log('Successfully connected to Salesforce');
    console.log('User Info:', {
      id: userInfo.id,
      organizationId: userInfo.organizationId,
    });
    console.log('Access Token:', conn.accessToken);
    console.log('Instance URL:', conn.instanceUrl);
    return conn;
  } catch (err) {
    console.error('Salesforce connection error:', {
      message: err.message,
      name: err.name,
    });
    throw err;
  }
};

let connectedConn;
connect()
  .then((connection) => {
    connectedConn = connection;
  })
  .catch((err) => {
    console.error('Initial connection failed:', err);
    process.exit(1);
  });

export default {
  get: () => connectedConn || conn,
  connect,
};
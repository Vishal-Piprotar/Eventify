import jsforce from 'jsforce';
import 'dotenv/config';

const conn = new jsforce.Connection({
  loginUrl: process.env.SF_LOGIN_URL,
});

const connect = async () => {
  try {
    const userInfo = await conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD);
    console.log('Connected to Salesforce',userInfo);
    return conn;
  } catch (err) {
    console.error('Salesforce connection error:', err);
    throw err;
  }
};

let connectedConn;
connect().then(connection => connectedConn = connection);

export default {
  get: () => connectedConn || conn,
  connect,
};
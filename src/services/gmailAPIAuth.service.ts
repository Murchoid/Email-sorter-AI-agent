import fs from 'fs';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../configs/config';
import path from 'path';
import process from 'process';

const ENVPATH = path.join(process.cwd(), '../.env');
const CREDENTIALS_PATH = path.join(process.cwd(), '../credentials/credentials.json');

async function loadSavedCredentials(): Promise<OAuth2Client | null> {
  try {
   
    const { client_id, client_secret, refresh_token } = config;
    const oAuth2Client = new OAuth2Client(client_id, client_secret);
    oAuth2Client.setCredentials({ refresh_token });
    return oAuth2Client;
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client: OAuth2Client) {
  const content = await fs.promises.readFile(CREDENTIALS_PATH, 'utf-8');
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const refreshToken = (client.credentials as any).refresh_token;

  const envData = [
    `CLIENT_ID=${key.client_id}`,
    `CLIENT_SECRET=${key.client_secret}`,
    `REFRESH_TOKEN=${refreshToken}`
  ].join('\n');

  await fs.promises.appendFile(ENVPATH, '\n' + envData);
  console.log('Credentials written to .env');
}

async function authorize(): Promise<OAuth2Client> {
  let client = await loadSavedCredentials();
  if (client) {
    return client;
  }
  client = (await authenticate({
    scopes: config.scope,
    keyfilePath: ENVPATH,
  })) as unknown as OAuth2Client;

  if (client?.credentials) {
    await saveCredentials(client);
  }

  return client;
}

authorize().catch(err=>{
  console.log(err)
})

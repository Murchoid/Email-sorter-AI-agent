import fs from 'fs';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../configs/config';

const TOKEN_PATH = config.token_path;
const SCOPE = config.scope;
const CREDENTIALS_PATH = config.credentials_path;

async function loadSavedCredentials(): Promise<OAuth2Client | null> {
  try {
    const content = await fs.promises.readFile(TOKEN_PATH, 'utf-8');
    const credentials = JSON.parse(content);

    const { client_id, client_secret, refresh_token, type } = credentials;
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
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: (client.credentials as any).refresh_token,
  });

  await fs.promises.writeFile(TOKEN_PATH, payload);
}

async function authorize(): Promise<OAuth2Client> {
  let client = await loadSavedCredentials();
  if (client) {
    return client;
  }
  client = (await authenticate({
    scopes: SCOPE,
    keyfilePath: CREDENTIALS_PATH,
  })) as unknown as OAuth2Client;

  if (client?.credentials) {
    await saveCredentials(client);
  }

  return client;
}

authorize().then((client) => {
  console.log(client.credentials.refresh_token);
});

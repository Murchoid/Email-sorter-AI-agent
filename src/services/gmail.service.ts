import { google } from 'googleapis';
import { config } from '../configs/config';
import fs from 'fs';

const contents = fs.readFileSync(config.credentials_path, 'utf-8');
const credentials = JSON.parse(contents);
const { client_id, client_secret, redirect_uris } =
  credentials.installed || credentials.web;

const tokenContents = fs.readFileSync(config.token_path, 'utf-8');
const { refresh_token } = JSON.parse(tokenContents);

const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);
oAuth2Client.setCredentials({ refresh_token });
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

export async function ensureLabelExists(labelName: string): Promise<string> {
  const res = await gmail.users.labels.list({ userId: 'me' });
  const existingLabel = res.data.labels?.find(
    (label) => label.name === labelName.trim()
  );

  if (existingLabel) {
    return existingLabel.id!;
  }

  const created = await gmail.users.labels.create({
    userId: 'me',
    requestBody: {
      name: labelName,
      labelListVisibility: 'labelShow',
      messageListVisibility: 'show',
    },
  });

  return created.data.id!;
}

export async function getRecentEmails() {
  const { data } = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 20,
    labelIds: ['INBOX'],
  });

  return data.messages || [];
}

export async function getEmailContent(messageId: string) {
  const msg = await gmail.users.messages.get({ userId: 'me', id: messageId });
  const subject =
    msg.data.payload?.headers?.find((h) => h.name === 'Subject')?.value || '';
  const snippet = msg.data.snippet || '';
  return { subject, snippet };
}

export async function applyLabel(messageId: string, labelId: string) {
  await gmail.users.messages.modify({
    userId: 'me',
    id: messageId,
    requestBody: {
      addLabelIds: [labelId],
    },
  });
}

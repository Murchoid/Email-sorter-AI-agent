import * as dotenv from 'dotenv';
dotenv.config();
import process from "process";

const SCOPE = process.env.GOOGLE_SCOPES?.split(',') ?? [];

export const config = {
  scope: SCOPE,
  refresh_token: process.env.REFRESH_TOKEN,
  gmailApi: process.env.GMAIL_API_KEY,
  geminiApi: process.env.GEMINI_API_KEY,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URI,
};


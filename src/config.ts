import * as dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import process from "process";

const SCOPE = ['https://www.googleapis.com/auth/gmail.labels','https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.modify'];
const TOKEN_PATH = path.join(process.cwd(), './src/credentials/token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), './src/credentials/credentials.json');

export const config = {
  scope: SCOPE,
  token_path: TOKEN_PATH,
  credentials_path: CREDENTIALS_PATH,
};


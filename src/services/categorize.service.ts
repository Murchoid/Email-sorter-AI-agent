import fs from 'fs';
import { config } from '../configs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const contents = fs.readFileSync(config.credentials_path, 'utf-8');
const keys = JSON.parse(contents);
const gemApiKey = keys.installed.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(gemApiKey);

export async function categorizeEmail(emailText: string): Promise<string> {
  const prompt = `Categorize this email into Work:	Job-related emails, tasks, meetings, documents from colleagues
Personal:	Messages from family, friends, personal sign-ups
Finance:	Bank statements, receipts, mobile money, loan details, etc.
LinkedIn:	All LinkedIn updates, connections, job alerts, etc.
Promotions:	Discounts, marketing emails, ecommerce sales
Social:	Notifications from social media platforms (FB, Instagram, Twitter/X)
Updates:	Newsletters, subscriptions, product updates, GitHub, dev tools
Education:	Online course updates, school emails, certificates
News:	Newsletters from media houses like BBC, CNN, Daily Nation, etc.
Travel:	Booking confirmations, flight/train info, AirBnB, Uber receipts
Health:	Hospital records, insurance, mental wellness, gym notifications
Shopping:	Orders from Jumia, Amazon, Bolt Food, delivery updates
Bills:	Rent, electricity, water, mobile data/airtime invoices
Tech:	Dev tools, AI updates, GitHub issues, API noticesprecise and accurate but only use one word, just give one word answer.

Email:
${emailText}

Category:`;

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categorizeEmail = categorizeEmail;
const fs_1 = __importDefault(require("fs"));
const config_1 = require("../configs/config");
const generative_ai_1 = require("@google/generative-ai");
const contents = fs_1.default.readFileSync(config_1.config.credentials_path, 'utf-8');
const keys = JSON.parse(contents);
const gemApiKey = keys.installed.GEMINI_API_KEY;
const genAI = new generative_ai_1.GoogleGenerativeAI(gemApiKey);
function categorizeEmail(emailText) {
    return __awaiter(this, void 0, void 0, function* () {
        const prompt = `Categorize this email into Work:	Job-related emails, tasks, meetings, documents from colleagues
Personal:	Messages from family, friends, personal sign-ups
Finance:	Bank statements, receipts, mobile money, loan details, etc.
LinkedIn:	All LinkedIn updates, connections, job alerts, etc.
Promotions:	Discounts, marketing emails, ecommerce sales
Social:	Notifications from social media platforms (FB, Instagram, Twitter/X)
Updates:	Newsletters, subscriptions, product updates, GitHub, dev tools
Education:	Online course updates, school emails, certificates
Spam:	Obvious junk you don’t want to see
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
        const result = yield model.generateContent(prompt);
        const response = yield result.response;
        return response.text();
    });
}

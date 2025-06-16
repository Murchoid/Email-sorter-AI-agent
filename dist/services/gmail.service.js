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
exports.ensureLabelExists = ensureLabelExists;
exports.getRecentEmails = getRecentEmails;
exports.getEmailContent = getEmailContent;
exports.applyLabel = applyLabel;
const googleapis_1 = require("googleapis");
const config_1 = require("../configs/config");
const fs_1 = __importDefault(require("fs"));
const contents = fs_1.default.readFileSync(config_1.config.credentials_path, 'utf-8');
const credentials = JSON.parse(contents);
const { client_id, client_secret, redirect_uris } = credentials.installed || credentials.web;
const tokenContents = fs_1.default.readFileSync(config_1.config.token_path, 'utf-8');
const { refresh_token } = JSON.parse(tokenContents);
const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials({ refresh_token });
const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
function ensureLabelExists(labelName) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const res = yield gmail.users.labels.list({ userId: 'me' });
        const existingLabel = (_a = res.data.labels) === null || _a === void 0 ? void 0 : _a.find((label) => label.name === labelName.trim());
        if (existingLabel) {
            return existingLabel.id;
        }
        const created = yield gmail.users.labels.create({
            userId: 'me',
            requestBody: {
                name: labelName,
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show',
            },
        });
        return created.data.id;
    });
}
function getRecentEmails() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield gmail.users.messages.list({
            userId: 'me',
            maxResults: 20,
            labelIds: ['INBOX'],
        });
        return data.messages || [];
    });
}
function getEmailContent(messageId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const msg = yield gmail.users.messages.get({ userId: 'me', id: messageId });
        const subject = ((_c = (_b = (_a = msg.data.payload) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.find((h) => h.name === 'Subject')) === null || _c === void 0 ? void 0 : _c.value) || '';
        const snippet = msg.data.snippet || '';
        return { subject, snippet };
    });
}
function applyLabel(messageId, labelId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield gmail.users.messages.modify({
            userId: 'me',
            id: messageId,
            requestBody: {
                addLabelIds: [labelId],
            },
        });
    });
}

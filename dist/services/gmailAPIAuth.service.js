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
const fs_1 = __importDefault(require("fs"));
const local_auth_1 = require("@google-cloud/local-auth");
const google_auth_library_1 = require("google-auth-library");
const config_1 = require("../configs/config");
const TOKEN_PATH = config_1.config.token_path;
const SCOPE = config_1.config.scope;
const CREDENTIALS_PATH = config_1.config.credentials_path;
function loadSavedCredentials() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield fs_1.default.promises.readFile(TOKEN_PATH, 'utf-8');
            const credentials = JSON.parse(content);
            const { client_id, client_secret, refresh_token, type } = credentials;
            const oAuth2Client = new google_auth_library_1.OAuth2Client(client_id, client_secret);
            oAuth2Client.setCredentials({ refresh_token });
            return oAuth2Client;
        }
        catch (err) {
            return null;
        }
    });
}
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield fs_1.default.promises.readFile(CREDENTIALS_PATH, 'utf-8');
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        yield fs_1.default.promises.writeFile(TOKEN_PATH, payload);
    });
}
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        let client = yield loadSavedCredentials();
        if (client) {
            return client;
        }
        client = (yield (0, local_auth_1.authenticate)({
            scopes: SCOPE,
            keyfilePath: CREDENTIALS_PATH,
        }));
        if (client === null || client === void 0 ? void 0 : client.credentials) {
            yield saveCredentials(client);
        }
        return client;
    });
}
authorize().catch(err => {
    console.log(err);
});

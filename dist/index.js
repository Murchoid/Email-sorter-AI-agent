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
Object.defineProperty(exports, "__esModule", { value: true });
const gmail_service_1 = require("./services/gmail.service");
const categorize_service_1 = require("./services/categorize.service");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const emails = yield (0, gmail_service_1.getRecentEmails)();
        for (const email of emails) {
            const { subject, snippet } = yield (0, gmail_service_1.getEmailContent)(email.id);
            const combined = `${subject}\n\n${snippet}`;
            const category = yield (0, categorize_service_1.categorizeEmail)(combined);
            console.log(`Email "${subject}" → ${category}`);
            const labelId = yield (0, gmail_service_1.ensureLabelExists)(category);
            if (labelId) {
                yield (0, gmail_service_1.applyLabel)(email.id, labelId);
                console.log(`Applied label ${category}`);
            }
        }
    });
}
main().catch(console.error);

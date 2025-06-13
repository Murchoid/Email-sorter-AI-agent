import {
  getRecentEmails,
  getEmailContent,
  applyLabel,
  ensureLabelExists,
} from './services/gmail.service';
import { categorizeEmail } from './categorize';

async function main() {
  const emails = await getRecentEmails();

  for (const email of emails) {
    const { subject, snippet } = await getEmailContent(email.id!);
    const combined = `${subject}\n\n${snippet}`;

    const category = await categorizeEmail(combined);
    console.log(`Email "${subject}" → ${category}`);

    const labelId = await ensureLabelExists(category);

    if (labelId) {
      await applyLabel(email.id!, labelId);
      console.log(`Applied label ${category}`);
    }
  }
}

main().catch(console.error);

import { dev } from '$app/env';
import { Client } from 'postmark';

const POSTMARK_FROM_EMAIL = import.meta.env.VITE_POSTMARK_FROM_EMAIL || '';
const POSTMARK_SERVER_API_TOKEN = import.meta.env.VITE_POSTMARK_SERVER_API_TOKEN || '';

if (!POSTMARK_SERVER_API_TOKEN) {
	console.warn('You have not configured a `POSTMARK_SERVER_API_TOKEN` environment variable.');
	console.warn('Sending emails will be disabled, and they will only be printed to the console.');
}

const client = new Client(POSTMARK_SERVER_API_TOKEN || 'NO_API_TOKEN');

interface Email {
	to: string;
	subject: string;
	textBody: string;
}

export async function sendEmail(email: Email) {
	if (dev) {
		console.log(`Sending email to "${email.to}"`);
		console.log(`Subject: ${email.subject}`);
		console.log(`Body: ${email.textBody}`);
	}

	if (!POSTMARK_SERVER_API_TOKEN) {
		return;
	}

	await client.sendEmail({
		From: POSTMARK_FROM_EMAIL,
		To: email.to,
		Subject: email.subject,
		TextBody: email.textBody,
		// In production, you might want to use something like mjml to create a more
		// visually appealing email, which you can pass through the `HtmlBody` property.
		// Resources: https://mjml.io/
		// HtmlBody: /* mjml-generated-html here */,
	});
}

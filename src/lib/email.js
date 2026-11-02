// src/lib/email.js

/**
 * Sends an email using the Resend API
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email body (HTML)
 */
export const sendEmail = async ({ to, subject, html }) => {
  // IMPORTANT: You should get your API Key from resend.com
  // and add VITE_RESEND_API_KEY to your .env file
  const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.warn('Resend API Key is missing. Email skipped.');
    return { success: false, error: 'Missing API Key' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'JESE Journal <onboarding@resend.dev>', // Change this after verifying your domain
        to: [to],
        subject: subject,
        html: html,
      }),
    });

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Email Error:', error);
    return { success: false, error };
  }
};

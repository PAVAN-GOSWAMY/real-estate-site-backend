export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'; // Fallback for dev

  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set. Email not sent.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Square AR Careers <${RESEND_FROM_EMAIL}>`,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Resend API Error:", data);
      return { success: false, error: data.message };
    }

    return { success: true, data };
  } catch (error: any) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

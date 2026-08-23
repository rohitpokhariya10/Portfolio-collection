import process from "node:process";
import { Resend } from "resend";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedProjectTypes = new Set([
  "Full-Stack Web App",
  "AI/SaaS Product",
  "Freelance/Contract",
  "Other",
]);

const readBody = (body) => {
  let parsedBody = body;

  if (typeof parsedBody === "string") {
    try {
      parsedBody = JSON.parse(parsedBody);
    } catch {
      return null;
    }
  }

  return parsedBody
    && typeof parsedBody === "object"
    && !Array.isArray(parsedBody)
    ? parsedBody
    : null;
};

const clean = (value) => (typeof value === "string" ? value.trim() : "");
const cleanSingleLine = (value) => clean(value).replace(/\s+/g, " ");

/**
 * Accepts portfolio inquiries and forwards them through a published Resend template.
 * Every client field is treated as untrusted at this server boundary.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = readBody(req.body);

  if (!body) {
    return res.status(400).json({ error: "Invalid request payload" });
  }

  // Keep template values that may be used in email headers on a single line.
  const firstName = cleanSingleLine(body.firstName);
  const lastName = cleanSingleLine(body.lastName);
  const email = clean(body.email);
  const phone = cleanSingleLine(body.phone);
  const projectType = clean(body.projectType);
  const message = clean(body.message);

  // Return an indistinguishable success when the hidden field is populated.
  // Timing heuristics are deliberately avoided because autofill can produce a
  // legitimate submission faster than any dependable server-side threshold.
  if (body.honeypot) {
    return res.status(200).json({ success: true });
  }

  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please provide a valid email address" });
  }

  if (!allowedProjectTypes.has(projectType)) {
    return res.status(400).json({ error: "Please select a valid project type" });
  }

  if (
    firstName.length > 80
    || lastName.length > 80
    || email.length > 254
    || phone.length > 30
    || message.length > 3000
  ) {
    return res.status(400).json({ error: "One or more fields are too long" });
  }

  const resendApiKey = clean(process.env.RESEND_API_KEY);
  const fromEmail = clean(process.env.RESEND_FROM_EMAIL);
  const destinationEmail = clean(process.env.CONTACT_TO_EMAIL);

  if (
    !resendApiKey
    || !fromEmail
    || !destinationEmail
    || !emailPattern.test(destinationEmail)
  ) {
    console.error("Contact email service configuration is incomplete or invalid");
    return res.status(500).json({
      error: "Unable to send your message right now. Please try again later.",
    });
  }

  try {
    // Instantiate per request so serverless invocations never depend on mutable
    // module-level client state; the platform can still reuse the loaded module.
    const resend = new Resend(resendApiKey);

    const { error } = await resend.emails.send({
      to: destinationEmail,
      replyTo: email,
      template: {
        id: "new-project-inquiry",
        variables: {
          FIRST_NAME: firstName,
          LAST_NAME: lastName,
          EMAIL: email,
          PHONE: phone,
          PROJECT_TYPE: projectType,
          MESSAGE: message,
        },
      },
    });

    if (error) {
      throw new Error(error.message || "Resend rejected the message");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({
      error: "Unable to send your message right now. Please try again later.",
    });
  }
}

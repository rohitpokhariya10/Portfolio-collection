import process from "node:process";
import { Resend } from "resend";

const destinationEmail = "rohit.pokhariya123@gmail.com";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const allowedProjectTypes = new Set([
  "Full-Stack Web App",
  "AI/SaaS Product",
  "Freelance/Contract",
  "Other",
]);

const readBody = (body) => {
  if (typeof body !== "string") {
    return body || {};
  }

  try {
    return JSON.parse(body);
  } catch {
    return {};
  }
};

const clean = (value) => String(value || "").trim();
const cleanSingleLine = (value) => clean(value).replace(/\s+/g, " ");

/**
 * Accepts portfolio inquiries and forwards validated plain text via Resend.
 * Every client field is treated as untrusted at this server boundary.
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = readBody(req.body);
  // Names are later interpolated into an email subject, so line folding is
  // removed even though Resend also validates header input.
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

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Email service is not configured yet" });
  }

  try {
    // Instantiate per request so serverless invocations never depend on mutable
    // module-level client state; the platform can still reuse the loaded module.
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL
        || "Portfolio Contact <onboarding@resend.dev>",
      to: destinationEmail,
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}`,
      text: [
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        `Phone: ${phone || "N/A"}`,
        `Type: ${projectType || "N/A"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (error) {
      throw new Error(error.message || "Resend rejected the message");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email send failed:", error);
    return res.status(500).json({ error: "Failed to send message, please try again" });
  }
}

// Vercel serverless contact endpoint using Resend, with honeypot and timing checks for simple bot suppression.
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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = readBody(req.body);
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email);
  const phone = clean(body.phone);
  const projectType = clean(body.projectType);
  const message = clean(body.message);
  const elapsedMs = Number(body.elapsedMs);

  // If the hidden field is filled or the form submits too quickly, pretend it worked and send nothing.
  if (body.honeypot || (Number.isFinite(elapsedMs) && elapsedMs < 2000)) {
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

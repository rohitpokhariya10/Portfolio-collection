import { Buffer } from "node:buffer";
import process from "node:process";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import contactHandler from "./api/contact.js";

// Vite evaluates this file as an ES module, so derive an absolute project root
// before exposing the `@` alias used throughout the client bundle.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const contactEnvironmentKeys = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
];
const maxContactBodyBytes = 32 * 1024;

const readRequestBody = async (request) => {
  const chunks = [];
  let bodySize = 0;

  for await (const chunk of request) {
    bodySize += chunk.length;

    if (bodySize > maxContactBodyBytes) {
      const error = new Error("Contact request payload is too large");
      error.statusCode = 413;
      throw error;
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
};

const addResponseHelpers = (response) => {
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };

  response.json = (payload) => {
    response.setHeader("Content-Type", "application/json; charset=utf-8");
    response.end(JSON.stringify(payload));
    return response;
  };

  return response;
};

const contactApiDevPlugin = (mode) => ({
  name: "portfolio-contact-api",
  apply: "serve",
  configureServer(server) {
    const localEnvironment = loadEnv(
      mode,
      __dirname,
      ["RESEND_", "CONTACT_"],
    );

    for (const key of contactEnvironmentKeys) {
      if (!process.env[key] && localEnvironment[key]) {
        process.env[key] = localEnvironment[key];
      }
    }

    server.middlewares.use(async (request, response, next) => {
      const pathname = new URL(request.url || "/", "http://localhost").pathname;

      if (pathname !== "/api/contact") {
        next();
        return;
      }

      const apiResponse = addResponseHelpers(response);

      try {
        if (request.method === "POST") {
          request.body = await readRequestBody(request);
        }

        await contactHandler(request, apiResponse);
      } catch (error) {
        if (apiResponse.writableEnded) {
          return;
        }

        if (error?.statusCode === 413) {
          apiResponse.status(413).json({ error: "Request payload is too large" });
          return;
        }

        console.error("Local contact API failed:", error);

        if (apiResponse.headersSent) {
          apiResponse.end();
          return;
        }

        apiResponse.status(500).json({
          error: "Unable to send your message right now. Please try again later.",
        });
      }
    });
  },
});

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), contactApiDevPlugin(mode)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

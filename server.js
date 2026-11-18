const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnvFile();

const port = Number(process.env.PORT || 4000);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, "utf8").split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  });
}

function sendJson(response, status, body) {
  response.writeHead(status, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:3000" });
  response.end(JSON.stringify(body));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1000000) request.destroy(new Error("Request too large"));
    });
    request.on("end", () => resolve(JSON.parse(body || "{}")));
    request.on("error", reject);
  });
}

async function sendEmail({ to, subject, message }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to: [to], subject, text: message }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || "Email provider rejected the message");
}

function gmailConfigured() {
  return process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN;
}

function encodeMessage({ to, subject, message }) {
  const mime = [`To: ${to}`, `Subject: ${subject}`, "Content-Type: text/plain; charset=utf-8", "MIME-Version: 1.0", "", message].join("\r\n");
  return Buffer.from(mime).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGmailAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.access_token) throw new Error(result.error_description || "Gmail authentication failed");
  return result.access_token;
}

async function gmailRequest(endpoint, method, body) {
  const accessToken = await getGmailAccessToken();
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${endpoint}`, {
    method,
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error?.message || "Gmail rejected the request");
  return result;
}

function validateDraft({ to, subject, message }, requireContent = false) {
  if (typeof to !== "string" || !emailPattern.test(to.trim())) return "Invalid email address";
  if (requireContent && (!subject?.trim() || !message?.trim())) return "Subject and message are required";
  return null;
}

async function saveGmailDraft({ draftId, to, subject = "", message = "" }) {
  const payload = { message: { raw: encodeMessage({ to: to.trim(), subject: subject.trim(), message }) } };
  return gmailRequest(draftId ? `drafts/${encodeURIComponent(draftId)}` : "drafts", draftId ? "PUT" : "POST", payload);
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, { "Access-Control-Allow-Origin": "http://localhost:3000", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, PUT, OPTIONS" });
    response.end();
    return;
  }

  if (request.method === "POST" && request.url === "/api/gmail/drafts") {
    try {
      if (!gmailConfigured()) { sendJson(response, 503, { error: "Gmail is not configured on the server" }); return; }
      const body = await readBody(request);
      const validationError = validateDraft(body);
      if (validationError) { sendJson(response, 400, { error: validationError }); return; }
      const draft = await saveGmailDraft(body);
      sendJson(response, 200, { draftId: draft.id });
    } catch (error) {
      console.error("Gmail draft creation failed:", error.message);
      sendJson(response, 502, { error: "Gmail draft synchronization failed" });
    }
    return;
  }

  if (request.method === "PUT" && request.url.startsWith("/api/gmail/drafts/")) {
    try {
      if (!gmailConfigured()) { sendJson(response, 503, { error: "Gmail is not configured on the server" }); return; }
      const draftId = decodeURIComponent(request.url.slice("/api/gmail/drafts/".length));
      const body = await readBody(request);
      const validationError = validateDraft(body);
      if (validationError) { sendJson(response, 400, { error: validationError }); return; }
      await saveGmailDraft({ ...body, draftId });
      sendJson(response, 200, { draftId });
    } catch (error) {
      console.error("Gmail draft update failed:", error.message);
      sendJson(response, 502, { error: "Gmail draft synchronization failed" });
    }
    return;
  }

  if (request.method === "POST" && request.url.startsWith("/api/gmail/drafts/") && request.url.endsWith("/send")) {
    try {
      if (!gmailConfigured()) { sendJson(response, 503, { error: "Gmail is not configured on the server" }); return; }
      const draftId = decodeURIComponent(request.url.slice("/api/gmail/drafts/".length, -"/send".length));
      const body = await readBody(request);
      const validationError = validateDraft(body, true);
      if (validationError) { sendJson(response, 400, { error: validationError }); return; }
      const sent = await gmailRequest(`drafts/${encodeURIComponent(draftId)}/send`, "POST", { id: draftId });
      sendJson(response, 200, { success: true, messageId: sent.id });
    } catch (error) {
      console.error("Gmail sending failed:", error.message);
      sendJson(response, 502, { error: "Gmail sending failed" });
    }
    return;
  }

  if (request.method !== "POST" || request.url !== "/api/send-email") {
    sendJson(response, 404, { error: "Not found" });
    return;
  }

  try {
    const { to, subject, message } = await readBody(request);
    if (typeof to !== "string" || !emailPattern.test(to.trim())) {
      sendJson(response, 400, { error: "Invalid email address" });
      return;
    }
    if (typeof subject !== "string" || !subject.trim() || typeof message !== "string" || !message.trim()) {
      sendJson(response, 400, { error: "Subject and message are required" });
      return;
    }
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      sendJson(response, 503, { error: "Email service is not configured on the server" });
      return;
    }
    await sendEmail({ to: to.trim(), subject: subject.trim(), message: message.trim() });
    sendJson(response, 200, { success: true });
  } catch (error) {
    console.error("Email sending failed:", error.message);
    sendJson(response, 502, { error: "Email sending failed" });
  }
});

server.listen(port, () => console.log(`Email API listening on http://localhost:${port}`));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

function normalizeValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactPayload(payload) {
  const nom = normalizeValue(payload?.nom ?? payload?.name);
  const email = normalizeValue(payload?.email);
  const message = normalizeValue(payload?.message);
  const botcheck = normalizeValue(payload?.botcheck ?? payload?._gotcha);
  const errors = {};

  if (!nom) errors.nom = "Indiquez votre nom.";
  if (!email) errors.email = "Indiquez votre email.";
  else if (!EMAIL_RE.test(email)) errors.email = "Entrez une adresse email valide.";
  if (!message) errors.message = "Décrivez votre besoin.";
  else if (message.length < 10) errors.message = "Votre message doit contenir au moins 10 caractères.";

  return { values: { nom, email, message, botcheck }, errors };
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

export async function handleContactSubmission(payload, env = process.env) {
  const { values, errors } = validateContactPayload(payload);

  if (Object.keys(errors).length > 0) {
    return { status: 400, body: { ok: false, errors } };
  }

  if (values.botcheck) {
    return { status: 200, body: { ok: true } };
  }

  const accessKey = normalizeValue(env.WEB3FORMS_ACCESS_KEY);

  if (!accessKey) {
    return {
      status: 500,
      body: { ok: false, message: "Le service d'envoi n'est pas configuré." },
    };
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "Projet - Evans Bilong",
      from_name: values.nom,
      name: values.nom,
      email: values.email,
      message: values.message,
      botcheck: values.botcheck,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    return {
      status: 502,
      body: { ok: false, message: "Une erreur est survenue. Réessayez." },
    };
  }

  return { status: 200, body: { ok: true } };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Méthode non autorisée." });
  }

  try {
    const payload = await readJsonBody(req);
    const result = await handleContactSubmission(payload);
    return res.status(result.status).json(result.body);
  } catch {
    return res.status(400).json({ ok: false, message: "Requête invalide." });
  }
}

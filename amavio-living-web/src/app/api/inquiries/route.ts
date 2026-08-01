import { NextResponse } from "next/server";

const MAX_REQUEST_BYTES = 16_384;
const allowedProfiles = new Set(["Arbeitgeber", "Bewohner", "Partner"]);
const allowedFields = new Set(["profile", "message", "name", "email", "consent"]);

type ValidInquiry = {
  profile: "Arbeitgeber" | "Bewohner" | "Partner";
  message: string;
  name: string;
  email: string;
  consent: true;
};

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function getWebhookUrl() {
  const configuredUrl = process.env.INQUIRY_WEBHOOK_URL?.trim();

  if (!configuredUrl) {
    return null;
  }

  let webhookUrl: URL;

  try {
    webhookUrl = new URL(configuredUrl);
  } catch {
    throw new Error("INQUIRY_WEBHOOK_URL is not a valid absolute URL.");
  }

  if (webhookUrl.protocol !== "https:") {
    throw new Error("INQUIRY_WEBHOOK_URL must use HTTPS.");
  }

  if (webhookUrl.username || webhookUrl.password || webhookUrl.hash) {
    throw new Error(
      "INQUIRY_WEBHOOK_URL must not contain URL credentials or a fragment.",
    );
  }

  return webhookUrl;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateInquiry(value: unknown):
  | { inquiry: ValidInquiry }
  | { error: string } {
  if (!isRecord(value)) {
    return { error: "Der JSON-Inhalt muss ein Objekt sein." };
  }

  const unknownField = Object.keys(value).find((key) => !allowedFields.has(key));

  if (unknownField) {
    return { error: `Unbekanntes Feld: ${unknownField}.` };
  }

  if (
    typeof value.profile !== "string" ||
    typeof value.message !== "string" ||
    typeof value.name !== "string" ||
    typeof value.email !== "string" ||
    typeof value.consent !== "boolean"
  ) {
    return {
      error:
        "Profil, Nachricht, Name und E-Mail müssen Textwerte sein; Einwilligung muss ein Wahrheitswert sein.",
    };
  }

  if (!allowedProfiles.has(value.profile)) {
    return { error: "Bitte wählen Sie ein gültiges Profil." };
  }

  const name = value.name.trim();
  const message = value.message.trim();
  const email = value.email.trim();

  if (name.length < 2 || name.length > 120) {
    return { error: "Der Name muss zwischen 2 und 120 Zeichen lang sein." };
  }

  if (message.length < 10 || message.length > 2_000) {
    return {
      error: "Die Nachricht muss zwischen 10 und 2.000 Zeichen lang sein.",
    };
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { error: "Bitte geben Sie eine gültige E-Mail-Adresse ein." };
  }

  if (value.consent !== true) {
    return {
      error: "Bitte bestätigen Sie die Datenschutz-Einwilligung.",
    };
  }

  return {
    inquiry: {
      profile: value.profile as ValidInquiry["profile"],
      message,
      name,
      email,
      consent: true,
    },
  };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();

  if (contentType !== "application/json") {
    return errorResponse("Content-Type muss application/json sein.", 415);
  }

  const contentLength = request.headers.get("content-length");

  if (contentLength !== null) {
    const parsedLength = Number(contentLength);

    if (!Number.isFinite(parsedLength) || parsedLength < 0) {
      return errorResponse("Ungültige Content-Length.", 400);
    }

    if (parsedLength > MAX_REQUEST_BYTES) {
      return errorResponse("Die Anfrage ist zu groß.", 413);
    }
  }

  const body = await request.text();

  if (new TextEncoder().encode(body).byteLength > MAX_REQUEST_BYTES) {
    return errorResponse("Die Anfrage ist zu groß.", 413);
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body);
  } catch {
    return errorResponse("Der Anfrageinhalt ist kein gültiges JSON.", 400);
  }

  const validation = validateInquiry(payload);

  if ("error" in validation) {
    return errorResponse(validation.error, 422);
  }

  let webhookUrl: URL | null;

  try {
    webhookUrl = getWebhookUrl();
  } catch (error) {
    console.error(
      "Inquiry webhook configuration is invalid.",
      error instanceof Error ? error.message : error,
    );
    return errorResponse("Die Anfragezustellung ist falsch konfiguriert.", 503);
  }

  if (!webhookUrl) {
    return errorResponse("Die Anfragezustellung ist noch nicht konfiguriert.", 503);
  }

  const reference = `AMAVIO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  let deliveryResponse: Response;

  try {
    deliveryResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "user-agent": "amavio-living-inquiry/1.0",
      },
      body: JSON.stringify({
        ...validation.inquiry,
        reference,
        receivedAt: new Date().toISOString(),
      }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    const isTimeout =
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    console.error(
      isTimeout
        ? "Inquiry webhook delivery timed out."
        : "Inquiry webhook delivery failed.",
      error instanceof Error ? error.message : error,
    );

    return errorResponse(
      isTimeout
        ? "Die Anfragezustellung hat zu lange gedauert."
        : "Die Anfrage konnte nicht zugestellt werden.",
      isTimeout ? 504 : 502,
    );
  }

  if (!deliveryResponse.ok) {
    console.error("Inquiry webhook rejected delivery.", {
      status: deliveryResponse.status,
    });
    return errorResponse("Die Anfrage konnte nicht zugestellt werden.", 502);
  }

  return NextResponse.json(
    {
      ok: true,
      status: "delivered",
      reference,
    },
    { status: 201 },
  );
}

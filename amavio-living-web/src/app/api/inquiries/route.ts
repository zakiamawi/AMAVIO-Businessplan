import { NextResponse } from "next/server";

type InquiryPayload = {
  profile?: unknown;
  message?: unknown;
  name?: unknown;
  email?: unknown;
  consent?: unknown;
};

const allowedProfiles = new Set(["Arbeitgeber", "Bewohner", "Partner"]);

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let payload: InquiryPayload;

  try {
    payload = (await request.json()) as InquiryPayload;
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const profile = String(payload.profile ?? "");
  const message = String(payload.message ?? "").trim();
  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const consent = payload.consent === true;

  if (!allowedProfiles.has(profile)) {
    return NextResponse.json({ error: "Bitte wählen Sie ein gültiges Profil." }, { status: 400 });
  }

  if (name.length < 2 || message.length < 10 || !isEmail(email)) {
    return NextResponse.json(
      { error: "Bitte füllen Sie Name, E-Mail und Bedarf verständlich aus." },
      { status: 400 },
    );
  }

  if (!consent) {
    return NextResponse.json({ error: "Bitte bestätigen Sie die Datenschutz-Einwilligung." }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    status: "prepared",
    reference: `AMAVIO-${Date.now().toString(36).toUpperCase()}`,
  });
}

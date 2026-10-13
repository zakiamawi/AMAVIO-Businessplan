"use client";

import { useMemo, useRef, useState } from "react";

const options = ["Arbeitgeber", "Bewohner", "Partner"] as const;
type Profile = (typeof options)[number];

const prompts: Record<Profile, string> = {
  Arbeitgeber: "Kohorte, Standort, Startfenster und Budgetroute",
  Bewohner: "Stadt, Einzugszeitpunkt, Wohnform und Arbeitgeberstatus",
  Partner: "Rolle, Region, Kapazität, Nachweise und nächstes Projektfenster",
};

function responseError(payload: unknown) {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof payload.error === "string"
  ) {
    return payload.error;
  }

  return "Die Anfrage konnte nicht zugestellt werden.";
}

export function RequestPanel() {
  const [profile, setProfile] = useState<Profile>("Arbeitgeber");
  const prompt = useMemo(() => prompts[profile], [profile]);
  const [message, setMessage] = useState(prompt);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const submitting = useRef(false);

  function clearFeedback() {
    setSuccess("");
    setError("");
  }

  return (
    <div className="request-panel" id="anfrage">
      <div>
        <p className="eyebrow">Digitale Erstaufnahme</p>
        <h2>Der erste Schritt wird bewusst klein gehalten.</h2>
        <p>
          AMAVIO startet mit einer strukturierten Anfrage statt einem offenen
          Kontaktformular. So wird früh klar, ob Discovery, Blueprint, Launch,
          Arrival Office oder eine saubere Übergabe der passende nächste Schritt ist.
        </p>
      </div>

      <form
        className="request-form"
        aria-busy={pending}
        onSubmit={async (event) => {
          event.preventDefault();

          if (submitting.current) {
            return;
          }

          submitting.current = true;
          setPending(true);
          clearFeedback();

          try {
            const response = await fetch("/api/inquiries", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                profile,
                message,
                name,
                email,
                consent,
              }),
            });
            const responseText = await response.text();
            let payload: unknown = null;

            if (responseText) {
              try {
                payload = JSON.parse(responseText);
              } catch {
                payload = null;
              }
            }

            if (!response.ok) {
              setError(responseError(payload));
              return;
            }

            setSuccess("Ihre Anfrage wurde sicher zugestellt.");
            setName("");
            setEmail("");
            setConsent(false);
            setMessage(prompts[profile]);
          } catch {
            setError(
              "Netzwerkfehler: Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
            );
          } finally {
            submitting.current = false;
            setPending(false);
          }
        }}
      >
        <fieldset disabled={pending}>
          <legend>Profil auswählen</legend>
          <div className="segmented" role="group" aria-label="Anfrageprofil">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={profile === option ? "active" : ""}
                aria-pressed={profile === option}
                onClick={() => {
                  setProfile(option);
                  setMessage(prompts[option]);
                  clearFeedback();
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          Was soll AMAVIO einordnen?
          <textarea
            name="message"
            value={message}
            rows={4}
            minLength={10}
            maxLength={2000}
            required
            disabled={pending}
            onChange={(event) => {
              setMessage(event.target.value);
              clearFeedback();
            }}
          />
        </label>

        <div className="form-grid">
          <label>
            Name
            <input
              name="name"
              type="text"
              placeholder="Ihr Name"
              autoComplete="name"
              value={name}
              minLength={2}
              maxLength={120}
              required
              disabled={pending}
              onChange={(event) => {
                setName(event.target.value);
                clearFeedback();
              }}
            />
          </label>
          <label>
            E-Mail
            <input
              name="email"
              type="email"
              placeholder="name@unternehmen.de"
              autoComplete="email"
              value={email}
              maxLength={254}
              required
              disabled={pending}
              onChange={(event) => {
                setEmail(event.target.value);
                clearFeedback();
              }}
            />
          </label>
        </div>

        <label className="checkline">
          <input
            name="consent"
            type="checkbox"
            checked={consent}
            required
            disabled={pending}
            onChange={(event) => {
              setConsent(event.target.checked);
              clearFeedback();
            }}
          />
          <span>Ich möchte eine projektbezogene Rückmeldung und akzeptiere die Datennutzung zur Bearbeitung dieser Anfrage.</span>
        </label>

        <button className="primary-action" type="submit" disabled={pending}>
          {pending ? "Anfrage wird zugestellt …" : "Anfrage senden"}
        </button>

        <div className="form-feedback" aria-live="polite" aria-atomic="true">
          {success ? (
            <p className="success-note" role="status">
              {success}
            </p>
          ) : null}
          {error ? (
            <p className="error-note" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}

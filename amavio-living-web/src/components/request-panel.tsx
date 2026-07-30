"use client";

import { useMemo, useState } from "react";

const options = ["Arbeitgeber", "Bewohner", "Partner"] as const;

export function RequestPanel() {
  const [profile, setProfile] = useState<(typeof options)[number]>("Arbeitgeber");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const prompt = useMemo(() => {
    if (profile === "Arbeitgeber") {
      return "Kohorte, Standort, Startfenster und Budgetroute";
    }

    if (profile === "Bewohner") {
      return "Stadt, Einzugszeitpunkt, Wohnform und Arbeitgeberstatus";
    }

    return "Rolle, Region, Kapazität, Nachweise und nächstes Projektfenster";
  }, [profile]);

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
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/inquiries", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              profile,
              message: form.get("message"),
              name: form.get("name"),
              email: form.get("email"),
              consent: form.get("consent") === "on",
            }),
          });

          if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { error?: string } | null;
            setError(payload?.error ?? "Die Anfrage konnte nicht vorbereitet werden.");
            return;
          }

          setSubmitted(true);
        }}
      >
        <fieldset>
          <legend>Profil auswählen</legend>
          <div className="segmented">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={profile === option ? "active" : ""}
                onClick={() => {
                  setProfile(option);
                  setSubmitted(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>

        <label>
          Was soll AMAVIO einordnen?
          <textarea name="message" value={prompt} readOnly rows={4} />
        </label>

        <div className="form-grid">
          <label>
            Name
            <input name="name" type="text" placeholder="Ihr Name" required />
          </label>
          <label>
            E-Mail
            <input name="email" type="email" placeholder="name@unternehmen.de" required />
          </label>
        </div>

        <label className="checkline">
          <input name="consent" type="checkbox" required />
          <span>Ich möchte eine projektbezogene Rückmeldung und akzeptiere die Datennutzung zur Bearbeitung dieser Anfrage.</span>
        </label>

        <button className="primary-action" type="submit">
          Anfrage vorbereiten
        </button>

        {submitted ? (
          <p className="success-note" role="status">
            Anfrage vorbereitet. In der nächsten Ausbaustufe wird dieser Vorgang als Lead, Projektbedarf oder Partnerprofil gespeichert.
          </p>
        ) : null}
        {error ? (
          <p className="error-note" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
